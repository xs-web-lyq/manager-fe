<template>
  <div class="out">
    <img src="@/assets/images/sl.webp" alt="">
    <el-button type="primary" class="goHome" @click="goHome">返回首页</el-button>
  </div>
</template>

<script>
export default {
  name: '404',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang='scss' scoped>
.out {
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 500px;
  }

  .goHome {
    vertical-align: bottom;
  }
}
</style>
