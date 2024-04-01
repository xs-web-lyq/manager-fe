<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" ref="userForm" :rules="rules">
        <div class="title">请假咯</div>
        <el-form-item prop="userName">
          <el-input type="text" placeholder="请输入账号" prefix-icon="User" v-model="user.userName">
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input show-password type="password" placeholder="请输入密码" prefix-icon="View" v-model="user.userPwd" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        <div class="test">测试账号</div>
        <div class="userName">username: test</div>
        <div class="passwd">password: 123456</div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../utils/utils'

export default {
  name: 'Login',
  data() {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [
          {
            required: true, massage: "请输入用户名", trigger: 'blur'
          }
        ],
        userPwd: [
          {
            required: true, message: "请输入密码", trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            this.$store.commit("saveUserInfo", res)
            await this.loadAsyncRoutes
            this.$router.push("/welcome")
          })
        } else {
          return false
        }
      })

    },
    // 动态路由
    async loadAsyncRoutes() {
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          const { menuList } = await api.getPermissionList();
          let routes = utils.generateRoute(menuList);
          routes.map((route) => {
            if (route.component) {
              let url = `../views/${route.component}.vue`;
              route.component = () => import(url);
              router.addRoute("Home", route);
            }
          });
          console.log(router.addRoute());
        } catch (err) { }
      }
    }
  },
  // setup(){
  //   const users = reactive({
  //     user:{
  //       userName:'',
  //       userPwd:''
  //     },
  //     rules:{
  //       userName:[
  //         {
  //           required:true,massage:"请输入用户名",trigger:'blur'
  //         }
  //       ],
  //       userPwd:[
  //         {
  //           required:true,message:"请输入密码",trigger:'blur'
  //         }
  //       ]
  //     }
  //   })
  //   // 获取全局属性
  //   const globalProperties = getCurrentInstance().appContext.config.globalProperties;
  //   const userForm = ref(null)
  //   const login = (userForm)=>{
  //     userForm.validate((valid)=>{
  //       if(valid){
  //         globalProperties.$api.login(users.user).then((res)=>{
  //           console.log(res);
  //         })
  //       }
  //     })

  //   }

  //   console.log(this);

  //   const {user,rules} = toRefs(users)
  //   return {user,rules,View,User,login,userForm}
  // },
}
</script>
<style lang='scss'>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #e5f0fb;

  .modal {
    width: 500px;
    padding: 50px;
    border-radius: 4px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;

    .title {
      text-align: center;
      font-size: 50px;
      line-height: 1.5;
      padding-bottom: 30px;
    }

    .login-btn {
      width: 100%;
    }

    .footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: 200px;
      height: 100px;
      background-color: #e5f0fb;
      border: 1px solid rgba(123, 121, 121, 0.5);
      border-radius: 5px;

      div {
        margin: 5px 0;
        font-size: 14px;
      }
    }

  }
}
</style>
