<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="ruleFormRef">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('ruleFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="新增用户" v-model="showModle">
      <el-form ref="logoForm" :model="userForm" label-width="100" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" :disabled="action === 'edit'" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" :disabled="action === 'edit'" placeholder="请输入用户邮箱">
            <template #append> @163.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择用户系统角色" multiple style="width:100%;">
            <el-option v-for="item in roleList" :key="item._id" :value="item._id" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader v-model="userForm.deptId" :options="deptList" placeholder="请选择所属部门"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable />
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
import { onMounted, ref, reactive, toRefs, getCurrentInstance, toRaw } from 'vue'
import utils from '../utils/utils'
export default {
  name: "User",
  // Composition API
  setup() {
    // getCurrentInstance方法只能在setup函数中使用，想要获取到上下文并获得全局挂载方法需要使用proxy属性进行调用
    const { proxy } = getCurrentInstance()
    const data = reactive({ user: { state: 1 }, columns: [], userList: [] })
    const value = ref('')
    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 4
    })
    // 动态表格格式
    data.columns = [
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户"
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用"
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        width: 180,
        formatter(row, column, value) {
          return utils.formateDate(new Date(value))
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        width: 180,
        formatter(row, column, value) {
          // 将时间字符串转换为时间对象以便调用相关方法，取得数据
          return utils.formateDate(new Date(value))
        }
      },
    ]
    // 弹框显示
    let showModle = ref(false)
    // 新增用户
    const userForm = reactive({ state: 1 })
    // 定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        },
      ],
      userEmail: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        },
      ],
      deptId: [
        {
          required: true,
          message: '请输入用户职位',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /1\d{10}/,
          message: '请输入正确的手机号格式',
          trigger: 'blur'
        }
      ]
    })
    // 选中用户列表的对象
    let checkedUserIds = ref([])
    // 部门列表
    const deptList = ref([])
    // 角色列表
    const roleList = ref([])
    // 用户创建行为
    const action = ref('add')



    onMounted(() => {
      getUserList()
      getDeptList()
      getRoleAllList()
    })
    // 获取用户列表
    const getUserList = async () => {
      let params = { ...data.user, ...pager }
      try {
        const { list, page } = await proxy.$api.getUserList(params)
        data.userList = list
        pager.total = page.total

      } catch (err) {
        console.log(err)
      }
    }
    // 查询事件，获取用户列表
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单
    const handleReset = (form) => {
      // console.log(proxy.$refs[form]);
      proxy.$refs?.[form].resetFields()
    }
    // 切换页号
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 单一用户删除
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        userIds: [row.userId]
      })
      proxy.$message.success('删除成功')
      getUserList()
    }
    // 批量用户删除
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value
      })
      if (res) {
        proxy.$message.success('删除成功')
        getUserList()
      }

    }
    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = []
      list.map(item => {
        arr.push(item.userId)
      })
      checkedUserIds.value = arr
    }
    // 用户新增
    const handleCreate = () => {
      action.value = 'add'
      showModle.value = true
    }
    // 获取部门信息
    const getDeptList = async () => {
      const res = await proxy.$api.getDeptList()
      deptList.value = res
    }
    // 获取角色列表
    const getRoleAllList = async () => {
      const res = await proxy.$api.getRoleAllList()
      roleList.value = res

    }
    // 用户弹窗关闭
    const handleClose = () => {
      showModle.value = false
      handleReset('logoForm')
    }
    // 提交
    const handleSubmit = () => {
      //提交前校验
      proxy.$refs.logoForm.validate(async (valid) => {
        if (valid) {
          // 将响应式对象转为普通对象
          let params = toRaw(userForm)
          console.log(params);
          params.userEmail += '@163.com'
          params.action = action.value
          console.log(params);
          const res = await proxy.$api.userSubmit(params)
          if (res) {
            showModle.value = false;
            proxy.$message.success('用户创建成功');
            handleReset('logoForm')
            getUserList()
          }
        }
      })
    }
    // 用户信息编辑
    const handleEdit = (row) => {
      action.value = "edit"
      showModle.value = true
      console.log(row);

      // 在下一个生命周期执行
      proxy.$nextTick(() => {
        // 使用浅拷贝将值赋给userForm
        Object.assign(userForm, row)
      })
    }
    const { user, columns, userList } = toRefs(data)
    return {
      user, value, columns, userList, action,
      handleQuery, handleReset, pager, handleCurrentChange,
      handlePatchDel, handleDel, handleSelectionChange,
      checkedUserIds, handleCreate, showModle, userForm, rules,
      roleList, deptList, handleClose, handleSubmit, handleEdit
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