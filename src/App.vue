<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name:'App',
    mounted(){
      // console.log(this.$storage);
      
      this.$storage.setItem("userInfo",{name:'liu',age:22})
      // this.$storage.clearAll()
      // console.log(this.$storage.getItem("userInfo"));
    }
  }
</script>

<style scoped>

</style>
