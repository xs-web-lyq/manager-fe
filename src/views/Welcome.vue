<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">请休假后台管理系统</div>
      <div class="desc">- Vue3.0+ElementPlus+Node+Mongo打造请休假后台管理系统</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>
<style lang='scss' scoped>
.welcome {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: #fff;

  .content {
    position: relative;
    top: -40px;
    padding-right: 100px;

    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }

    .title {
      font-size: 40px;
      line-height: 62px;
      color: rgb(0, 132, 255)
    }

    .desc {
      text-align: right;
      font-size: 14px;
      color: #b4b2b2;
    }
  }

  .img {
    background-image: url(../assets/images/bgimg.webp);
    background-size: cover;
    width: 371px;
    height: 438px;
  }
}
</style>
