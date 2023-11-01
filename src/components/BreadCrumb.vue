<template>
  <template>
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="item in breadList" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
  </template>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import {markRaw} from 'vue'
export default {
    name:'BreadCrumb',
    data(){
      return {
        ArrowRight :markRaw(ArrowRight)
      }
    },
    computed:{
      breadList(){
        return  this.$route.matched
      }
    },
    mounted(){
      console.log(this.$route);
    }
}
</script>
<style lang='scss' scoped>
</style>
