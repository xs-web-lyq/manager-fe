<template>
  <div class="basic-layout">
    <!--  通过isCollapse来控制侧边栏的长度，，home页布局为左右布局所以，使用导航固定宽，右侧自适应的方式进行布局 -->
    <div :class="['nav-side', isCollapse ? 'unfold' : 'fold']">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/logo.jpeg" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu :default-active="activeMenu" router :collapse="isCollapse" class="nav-menu">
        <TreeMenu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold">
            <!-- 控制是否展开导航栏 -->
            <el-icon @click="toggle">
              <Expand />
            </el-icon>
          </div>
          <div class="bread">
            <!-- 由于未知原因抽离出组件之后不能显示--退而求其次不再进行抽离 -->
            <el-breadcrumb :separator-icon="ArrowRight">
              <!-- 循环面包屑--因为目录只有两级所以只需要给首页栏跳转功能即可 -->
              <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
                <!-- 使用if-else 进行循环条件判断显示数据 -->
                <router-link to="/welcome" v-if="index == 0"> {{ item.meta.title }}</router-link>
                <span v-else>{{ item.meta.title }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>

          </div>
        </div>

        <div class="user-info">
          <!-- 铃铛提示设置--设置跳转到待审批页面 -->
          <el-badge :is-dot="noticeCount > 0" class="notice" type="danger" @click="$router.push('/audit/check')">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <!-- 用户信息下拉菜单显示 -->
          <el-dropdown @command="handleLogout" class="nav-link">
            <el-button class="nav-btn">
              {{ userInfo.userName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>


<script>
import TreeMenu from './TreeMenu.vue'
// import BreadCrumb from './BreadCrumb.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
export default {
  name: 'Home',
  components: { TreeMenu },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      userMenu: [],
      activeMenu: location.hash.slice(1),
      // 必须在data中返回element-plus的图标，通过使用markRaw将图标的响应性取消变为浅层引用
      ArrowRight: markRaw(ArrowRight)
    }
  },
  computed: {
    breadList() {
      return this.$route.matched
    },
    noticeCount() {
      return this.$store.state.noticeCount
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
    console.log(this.$route.matched);
  },
  methods: {
    // 添加下拉菜单点击事件-退出登录清楚本地缓存信息
    handleLogout(key) {
      if (key == 'email') {
        return
      }
      this.$store.commit("saveUserInfo", '');
      this.userInfo = ''
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount()
        // 使用vuex保存count值
        this.$store.commit('saveNoticeCount', count)

      } catch (err) {
        console.log(err);
      }
    },
    async getMenuList() {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList()
        this.userMenu = menuList
        this.$store.commit("saveMenuList", menuList)
        this.$store.commit("saveActionList", actionList)
      } catch (err) {
        console.log(err);
      }

    }

  }


}


</script>

<style lang="scss" scoped>
.basic-layout {
  display: flex;

  .nav-side {
    height: 100vh;
    color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    // 动画
    transition: width .5s;

    .logo {
      display: flex;
      align-items: center;
      width: 200px;
      font-size: 18px;
      height: 50px;
      background: #fff;
      color: #001529;

      img {
        width: 50px;
        height: 40px;
        margin: 0 9px;
      }
    }

    .nav-menu {
      height: calc(100vh - 50px)
    }
  }

  .fold {
    width: 200px;
  }

  .unfold {
    width: 64px
  }

  .content-right {
    flex: 1;
    height: 100vh;
    overflow: hidden;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d2d4d7;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          position: relative;
          top: 2px;
          margin-right: 16px;
          font-size: 18px;
        }
      }

      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 16px;
          cursor: pointer;
        }

        .nav-link {
          position: relative;
          top: 8px;

          .nav-btn {
            border: none
          }

          .nav-btn:hover {
            border: none;
            background: #fff;
          }
        }
      }
    }
  }

  .wrapper {
    background: #eee;
    padding: 20px 20px 0 20px;
    height: calc(100vh - 70px);
  }
}
</style>
