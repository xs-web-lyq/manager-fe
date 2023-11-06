<template>
  <!-- :model="user" 绑定查询数据 -->
  <el-form :inline="true" :model="qureyModel" ref="queryForm">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="qureyModel[item.model]" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
    </el-form-item>
    <!-- 通过ref绑定表单进行重置 -->
    <el-form-item>
      <el-button @click="handleReset()">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import FormItem from './FormItem.vue'
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: 'QueryForm',
  props: ["modelValue", 'form'],
  emits: ["update:modelValue", "handleQuery"],
  components: { FormItem },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const form = props.form
    const qureyModel = reactive({
      ...props.modelValue
    })

    const handleReset = () => {
      proxy.$refs.queryForm.resetFields()
    }
    const handleQuery = () => {
      context.emit("update:modelValue", { ...qureyModel })
      context.emit("handleQuery", { ...qureyModel })
    }

    return {
      handleReset,
      handleQuery,
      form,
      qureyModel
    }
  }
}
</script>
