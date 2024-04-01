<template>
  <div class="base-table">
    <!-- 通过自定义指令来控制按钮显示与隐藏 -->
    <div class="action">
      <slot name="actions"></slot>
    </div>
    <!-- @selection-change="handleSelectionChange" 多选事件获取选定_id提供批量删除数据 -->
    <el-table v-bind="$attrs">
      <template v-for="item in columns" :key="item.prop">
        <el-table-column type="selection" width="55" v-if="item.type == 'selection'" key="selection"></el-table-column>
        <el-table-column v-else-if="!item.type" v-bind="item">
        </el-table-column>
        <el-table-column v-if="item.type == 'action'" v-bind="item">
          <!-- 自定义插槽获取当前行值 -->
          <template #default="scope">
            <template v-for="(btn, index) in item.list">
              <el-button :type="btn.type" @click="handleAction(index, scope.row)" v-has="btn.icon">{{ btn.text
                }}</el-button>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- :total控制数据数量 :page-size设置一页数据条数 通过 @current-change事件控制页面切换-->
    <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
      :page-size="pager.pageSize" @current-change="handleCurrentChange" />
  </div>
</template>

<script>


export default {
  name: 'BaseTable',
  props: ["columns", "userList", 'pager'],
  setup(props, context) {
    const handleAction = (index, row) => {
      // 向上传输不要传递响应式对象---子组件向父组件传值
      context.emit("handleAction", { index, row: { ...row } })
    }
    const handleCurrentChange = (pageNum) => {
      context.emit("handleCurrentChange", pageNum)
    }
    return { handleAction, handleCurrentChange }
  }

}
</script>
<style lang='scss' scoped>
.pagination {
  justify-content: flex-end;
  padding: 8px 20px;
}

.action {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
</style>
