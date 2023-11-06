<template>
  <div class="base-table">
    <!-- 通过自定义指令来控制按钮显示与隐藏 -->
    <div class="action">
      <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
      <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
    </div>
    <!-- @selection-change="handleSelectionChange" 多选事件获取选定_id提供批量删除数据 -->
    <el-table :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width" :key="item.prop"
        :formatter="item.formatter">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- scope.row 获取一行数据 -->
          <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-has="'user-edit'">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)" v-has="'user-delete'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :total控制数据数量 :page-size设置一页数据条数 通过 @current-change事件控制页面切换-->
    <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
      :page-size="pager.pageSize" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
export default {

}
</script>
<style lang='scss' scoped></style>
