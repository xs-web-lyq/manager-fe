<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="roleList" row-key="_id" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleAdd(2, scope.row)">新增</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="角色创建" v-model="showModle">
      <el-form ref="logoForm" :model="roleForm" label-width="100" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="menuForm.parentId" :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1" size="large">菜单</el-radio>
            <el-radio :label="2" size="large">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.icon" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType == 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType == 1">
          <el-radio-group v-model="menuForm.menuState" class="ml-4">
            <el-radio :label="1" size="large">正常</el-radio>
            <el-radio :label="2" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils/utils'
export default {
  name: "Menu",
  // Options API
  mounted() {
    this.getRoleList()
  },
  data() {
    return {
      queryForm: { roleName: '' },
      roleList: [],
      pager: {},
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 180
        }, {
          label: "备注",
          prop: "remark"
        }, {
          label: "权限列表",
          prop: "",
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ],
      showModel: false,
      // 权限展示
      showPermission: false,
      curRoleName: '',
    }
  },
  methods: {
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList(this.queryForm)
        this.roleList = list
        this.pager = page
        this.handleReset("queryForm")
      } catch (err) {
        console.log(err);
      }

    },
    handleAdd() {

    },
    handleEdit() {

    },
    handleDel() {

    },
    handleReset(form) {
      this.$refs[form].resetFields()
    }



  }


}
</script>
<style lang='scss' scoped>
.user-manage {
  height: 100%;
  overflow-y: scroll;
}

.query-form {
  display: flex;
  align-items: center;
  background: #fff;
  padding-top: 18px;
  margin-bottom: 16px;
  padding-left: 20px;
  border-radius: 4px;
}

.base-table {
  background: #fff;
  border-radius: 4px;
  color: black;

  .action {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
}

.pagination {
  justify-content: flex-end;
  padding: 8px 20px;
}
</style>
