<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user">用户</div>
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
export default {
  name:'Home',

}


</script>

<style lang="scss" scoped>
.basic-layout{
  position:relative;
  .nav-side{
    position:fixed;
    width:200px;
    height:100vh;
    background: #001529;
    color:#fff;
    overflow: auto;
    // 动画
    transition: width .5s;
  }
  .content-right{
    margin-left: 200px;
    height:100vh;
    overflow: hidden;
    .nav-top{
      height:50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d2d4d7;
      padding:0 20px;
    }
  }
  .wrapper{
    background: #eee;
    padding:20px;
    height:calc(100vh - 90px);
    .main-page{
      background: #fff;
      height: 100%;
    }
  }
}
</style>
