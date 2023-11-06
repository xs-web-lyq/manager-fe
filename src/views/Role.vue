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
        <el-button type="primary" @click="handleAdd" v-has="'role-create'">创建</el-button>
      </div>
      <el-table :data="roleList" row-key="_id" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-has="'role-edit'">编辑</el-button>
            <el-button type="primary" size="small" @click="handleOpenPermission(scope.row)"
              v-has="'role-edit'">设置权限</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)" v-has="'dept-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="角色创建" v-model="showModle">
      <el-form ref="logoForm" :model="roleForm" label-width="100" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注" />
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
    <!-- 权限弹框 -->
    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree ref="permissionTree" :data="menuList" default-expand-all="true" show-checkbox node-key="_id" :props="{
            label: 'menuName',
          }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">
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
    this.getMenuList()
  },
  data() {
    return {
      queryForm: { roleName: '' },
      roleList: [],
      pager: {
        pageNum: 1,
        pageSize: 4
      },
      roleForm: {},
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ]
      },

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
          prop: "permissionList",
          width: 200,
          formatter: (row, column, value) => {
            let names = []
            // 获取当前角色的菜单列表_id
            let list = value.halfCheckedKeys || []
            // 遍历菜单列表_id
            list.map(key => {
              // 与全量的过滤过后的菜单列表比对获取权限名称
              let name = this.actionMap[key]
              if (key && name) names.push(name)
            })
            return names.join(",")
          }
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ],
      showModle: false,
      // 权限展示
      showPermission: false,
      curRoleName: '',
      curRoleId: '',
      action: 'create',
      menuList: [],
      // 菜单映射表
      actionMap: {}
    }
  },
  methods: {
    // 获得角色列表
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList({ ...this.queryForm, ...this.pager })
        this.roleList = list
        this.pager = page
        this.handleReset("queryForm")
      } catch (err) {
        console.log(err);
      }

    },
    // 获得角色列表
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList()
        this.menuList = list
        // 将
        this.getActionMap(list)
      } catch (err) {
        console.log(err);
      }
    },
    // 角色创建
    handleAdd() {
      this.action = 'create'
      this.showModle = true
    },
    // 角色编辑
    handleEdit(row) {
      this.action = 'edit'
      this.showModle = true
      this.$nextTick(() => {
        this.roleForm = { _id: row._id, roleName: row.roleName, remark: row.remark }
      })
    },
    // 角色删除
    async handleDel(_id) {
      await this.$api.roleSubmit({ _id, action: 'delete' })
      this.$message.success('删除成功')
      this.getRoleList()
    },
    //表单重置
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 表单取消
    handleClose() {
      this.showModle = false
      this.handleReset("logoForm")
    },
    // 提交表单
    handleSubmit() {
      this.$refs.logoForm.validate(async (valid) => {
        if (valid) {
          let { action, roleForm } = this
          const params = { ...roleForm, action }
          let res = await this.$api.roleSubmit(params)
          this.showModle = false
          this.$message.success("操作成功")
          this.handleReset('logoForm')
          this.getRoleList()
        }
      })
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current
      this.getRoleList()
    },
    handleOpenPermission(row) {
      // 保存当前角色_id以备提交更改使用
      this.curRoleId = row._id
      // 用于弹框页显示使用
      this.curRoleName = row.roleName

      this.showPermission = true
      // 获取按钮_id
      let { checkedKeys } = row.permissionList
      // 设置宏任务来解决弹框权限初始化问题
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys)
      })
    },
    async handlePermissionSubmit() {
      // 获取选中的节点其可能包括，菜单所以需要用节点中是否拥有children加进行过滤
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      // 获得半选状态下的节点_id
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      let checkedKeys = []
      let parentKeys = []
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id)
        } else {
          parentKeys.push(node._id)
        }
      })
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          // 合并半选状态节点和全选状态的菜单节点id
          halfCheckedKeys: parentKeys.concat(halfKeys),
        }
      }

      await this.$api.updatePermission(params);
      this.showPermission = false
      this.$message.success("设置成功")
      this.getRoleList()
    },

    getActionMap(list) {
      let actionMap = {}
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop()
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName
          }
          if (item.children && !item.action) {
            deep(item.children)
          }
        }
      }
      deep(JSON.parse(JSON.stringify(list)))
      this.actionMap = actionMap
    }

  }


}
</script>
<style lang='scss' scoped>
.role-manage {
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
