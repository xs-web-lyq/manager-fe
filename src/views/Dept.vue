<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名单" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button type="info" @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has="'dept-create'">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
        <el-table-column v-for=" item  in  columns " v-bind="item" :key="item.prop"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)" v-has="'dept-edit'">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.row._id)" v-has="'dept-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="showModle" :title="action == 'create' ? 'create' : 'edit'">
      <el-form ref="logoForm" :model="deptForm" label-width="100" :rules="rules">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader placeholder="请选择上级部门" v-model="deptForm.parentId" :options="deptList" :show-all-levels="true"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <!-- 添加change事件--当选中的负责人改变时邮箱同时改变 -->
          <el-select v-model="deptForm.user" placeholder="请选择部门负责人" @change="handleUser">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input disabled v-model="deptForm.userEmail" placeholder="请输入负责人邮箱"></el-input>
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
  name: 'Dept',
  data() {
    return {
      queryForm: {
        deptName: ''
      },
      deptList: [],
      deptForm: {
        parentId: [null]
      },
      columns: [
        {
          prop: 'deptName',
          label: '部门名称'
        },
        {
          prop: 'userName',
          label: '负责人'
        },
        {
          prop: 'updateTime',
          label: '更新时间',
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
        {
          prop: 'createTime',
          label: '创建时间',
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ],
      pager: {
        pageNum: 1,
        pageSize: 4,
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请输入上级部门',
            trigger: 'blur'
          },
        ],
        deptName: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
        ],
        user: [
          {
            required: true,
            message: "请选择负责人",
            trigger: 'blur'
          }
        ]
      },
      userList: [],
      action: 'create',
      showModle: false,
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  },
  methods: {
    // 获取部门列表
    async getDeptList() {
      const list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    // 获取用户列表，
    async getAllUserList() {
      const list = await this.$api.getAllUserList()
      this.userList = list
    },
    // 更新负责人信息
    handleUser(val) {
      const [userId, userName, userEmail] = val.split('/')
      Object.assign(this.deptForm, { userEmail, userId, userName })
    },
    // 还原输入框
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 创建部门
    handleOpen() {
      this.action = "create"
      this.showModle = true
    },
    // 编辑部门
    handleEdit(row) {
      this.action = 'edit'
      this.showModle = true
      // 
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, { user: `${row.userId}/${row.userName}/${row.userEmail}` })
      })
    },
    async handleDel(_id) {
      this.action = "delete"
      await this.$api.deptOperate({ _id, action: this.action })
      this.$message.success('操作成功')
      this.getDeptList()
    },
    handleClose(form) {
      this.handleReset("logoForm")
      this.showModle = false
    },
    handleSubmit() {
      this.$refs.logoForm.validate(async (valid) => {
        if (valid) {
          let params = { ...this.deptForm }
          params.action = this.action
          delete params.user
          let res = await this.$api.deptOperate(params)
          this.$message.success('操作成功')
          this.handleClose()
          this.getDeptList()
        }
      })

    }

  }

}
</script>
<style lang='scss' scoped>
.dept-manage {
  .query-form {
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
}
</style>

