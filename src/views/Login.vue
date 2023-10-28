<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" ref="userForm" :rules="rules">
        <div class="title">天王星</div>
        <el-form-item prop="userName">
          <el-input type="text" placeholder="请输入账号" prefix-icon="User" v-model="user.userName">
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" placeholder="请输入密码" prefix-icon="View" v-model="user.userPwd"/>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>


export default {
  name:'Login',
  data(){
    return {
      user:{
        userName:'',
        userPwd:''
      },
      rules:{
        userName:[
          {
            required:true,massage:"请输入用户名",trigger:'blur'
          }
        ],
        userPwd:[
          {
            required:true,message:"请输入密码",trigger:'blur'
          }
        ]
      }
    }
  },
  methods:{
    login(){
      this.$refs.userForm.validate((valid)=>{
        if(valid){
          this.$api.login(this.user).then((res)=>{
            this.$store.commit("saveUserInfo",res)
            this.$router.push("/welcome")
          })
        }else{
          return false
        }
      })

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
.login-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  width:100vw;
  height: 100vh;
  background: #e5f0fb;
  .modal{
    width:500px;
    padding: 50px;
    border-radius:4px ;
    background: #ffffff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title{
      text-align: center;
      font-size: 50px;
      line-height: 1.5;
      padding-bottom:30px;
    }
    .login-btn{
      width:100%;
    }
  }
}
</style>
