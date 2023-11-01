<template>
  <div class="basic-layout">
    <div :class="['nav-side',isCollapse ? 'unfold' : 'fold']">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/logo.jpeg" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <TreeMenu :userMenu="userMenu"/>
        
      </el-menu>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold">
            <el-icon @click="toggle"><Expand /></el-icon>
          </div>
          <div class="bread">
            <!-- 由于未知原因抽离出组件之后不能显示--退而求其次不再进行抽离 -->
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item  v-for="(item,index) in breadList" :key="item.path">
                <router-link to="/welcome" v-if="index == 0">   {{ item.meta.title }}</router-link>
                <span v-else>{{ item.meta.title }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>

          </div>
        </div>
      
        <div class="user-info">
          <el-badge :is-dot="noticeCoutn>0" class="notice" type="danger">
            <el-icon><Bell /></el-icon>
          </el-badge>
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
       <div class="main-page">
        <router-view></router-view>
       </div>
      </div>
    </div>
  </div>
</template>


<script>
import TreeMenu from './TreeMenu.vue'
// import BreadCrumb from './BreadCrumb.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import {markRaw} from 'vue'
export default {
  name:'Home',
  components:{TreeMenu},
  data(){
    return {
      isCollapse:false,
      userInfo:this.$store.state.userInfo,
      noticeCoutn:0,
      userMenu:[],
      activeMenu:location.hash.slice(1),
      // 必须在data中返回element-plus的图标，通过使用markRaw将图标的响应性取消变为浅层引用
      ArrowRight: markRaw(ArrowRight)
    }
  },
  computed:{
    breadList(){
      return  this.$route.matched
    }
  },
  mounted(){
    this.getNoticeCount()
    this.getMenuList()
  },
  methods:{
    handleLogout(key){
      if(key == 'email'){
        return 
      }
      this.$store.commit("saveUserInfo",'');
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle(){
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount(){
      try{
        const res = await this.$api.noticeCount()
        this.noticeCoutn = res
      }catch(err){
        console.log(err);
      }
    },    
    async getMenuList(){
      try{
        const res = await this.$api.getMenuList()
        this.userMenu = res
      }catch(err){
        console.log(err);
      }
      
    }

  }
  

}


</script>

<style lang="scss" scoped>

.basic-layout{
  display: flex;
  .nav-side{
    height:100vh;
    color:#fff;
    overflow-x: hidden;
    overflow-y: auto;
    // 动画
    transition: width .5s;
    .logo{
      display: flex;
      align-items: center;
      width:200px;
      font-size: 18px;
      height: 50px;
      background: #fff;
      color:#001529;
      img{
        width: 50px;
        height: 40px;
        margin:0 9px;
      }
    }
    .nav-menu{
      height:calc(100vh - 50px)
    }
  }
  .fold{
    width:200px;
  }
  .unfold{
    width:64px
  }
  .content-right{
    flex:1;
    height:100vh;
    overflow: hidden;
    .nav-top{
      height:50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d2d4d7;
      padding:0 20px;
      .nav-left{
        display: flex;
        align-items: center;
        .menu-fold{
          position: relative;
          top:2px;
          margin-right: 16px;
          font-size: 18px;
        }
      }
      .user-info{
        .notice{
          line-height: 30px;
          margin-right: 16px;
        }
        .nav-link{
          position: relative;
          top:8px;
          .nav-btn{
            border:none
          }
          .nav-btn:hover{
            border:none;
            background: #fff;
          }
        }
      }
    }
  }
  .wrapper{
    background: #eee;
    padding:20px;
    height:calc(100vh - 90px);
    .main-page{
    
      height: 100%;
    }
  }
}
</style>
