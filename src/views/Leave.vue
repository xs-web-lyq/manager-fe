<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForms">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('queryForms')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleApply" v-has="'leave-create'">申请休假</el-button>
      </div>
      <el-table :data="leaveList">
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="handleDetail(scope.row)" v-has="'leave-query'">查看</el-button>
            <!-- 当状态为审批中和待审批时才可以进行作废，使用es6新增语法判断数组中是否存在某个值使用includes()进行判断 -->
            <el-button type="danger" @click="handleDel(scope.row._id)" v-if="[1, 2].includes(scope.row.applyState)"
              v-has="'leave-delete'">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.pageSize" v-model:current-page="pager.pageNum" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="申请休假" v-model="showModle" width="70%">
      <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 因为此时需要在一行校验两个元素，所以需要使用el-row和el-col内部包含el-form-item进行嵌套校验 -->
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker v-model="leaveForm.startTime" type="date" placeholder="选择开始时间"
                  @change="(val) => handleDateChange('startTime', val)" />
              </el-form-item>
            </el-col>
            <el-col :span="1"> —— </el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker v-model="leaveForm.endTime" type="date" placeholder="选择结束时间"
                  @change="(val) => handleDateChange('endTime', val)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input type="textarea" :row="3" placeholder="请输入休假原因" v-model="leaveForm.reasons" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModel" destroy-on-close>
      <el-steps :active="detail.applyState > 2 ? 3 : detail.applyState" align-center>
        <el-step title="待审批" />
        <el-step title="审批中" />
        <el-step title="审批通过/审批拒绝" />
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型">
          <div>{{ detail.applyType }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs, getCurrentInstance, toRaw, computed, shallowReactive } from 'vue'
import utils from '../utils/utils'
export default {
  name: "Leave",
  // Composition API
  setup() {
    // getCurrentInstance方法只能在setup函数中使用，想要获取到上下文并获得全局挂载方法需要使用proxy属性进行调用
    const { proxy } = getCurrentInstance()
    const queryForm = reactive({
      applyState: 1
    })
    const leaveList = ref([])
    // 初始化分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 4
    })
    // 解决验证提示应为自己定义rules
    const rules = reactive({
      startTime: [
        {
          type: "date",
          required: true,
          message: "请输入开始日期",
          trigger: "change"
        }
      ],
      endTime: [
        {
          type: "date",
          required: true,
          message: "请输入结束日期",
          trigger: "change"
        }
      ],
      reasons: [
        {
          required: true,
          message: "请输入休假原因",
          trigger: "blur"
        }
      ]
    })

    // 弹框详情
    const detail = ref({})
    // 动态表格格式
    const columns = [
      {
        label: '单号',
        prop: 'orderNo',
        width: 120
      },
      {
        label: '时间',
        prop: '',
        formatter(row) {
          return `${utils.formateDate(new Date(row.createTime), 'yyyy-MM-dd')}到${utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')}`
        },
        width: 120
      },
      {
        label: '休假时长',
        prop: 'leaveTime'
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter(row, column, value) {
          return {
            1: "事假",
            2: "调休",
            3: "年假"
          }[value]
        }
      },
      {
        label: '申请时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return utils.formateDate(new Date(value), 'yyyy-MM-dd')
        },
        width: 120

      },
      {
        label: '审批人',
        prop: 'auditUsers',
        width: 180
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName',
        width: 120

      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter(row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废',
          }[value]
        }
      },
    ]
    const leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reasons: ""
    })
    // 弹框显示
    const showModle = ref(false)
    // 进度弹框展示
    const showDetailModel = ref(false)
    // action
    const action = ref("create")

    onMounted(() => {
      getLeaveList()

    })
    // 获取用户列表
    const getLeaveList = async () => {
      let params = { ...queryForm, ...pager }
      try {
        const { list, page } = await proxy.$api.getLeaveList(params)
        leaveList.value = list
        pager.total = page.total

      } catch (err) {
        console.log(err)
      }
    }
    // 查询事件，获取用户列表
    const handleQuery = () => {
      getLeaveList()
    }
    // 重置查询表单
    const handleReset = (form) => {
      proxy.$refs[form].resetFields()
    }
    // 添加申请
    const handleApply = () => {
      showModle.value = true
      action.value = 'create'
    }

    // 用户弹窗关闭
    const handleClose = () => {
      showModle.value = false
      handleReset('dialogForm')
    }
    const handleSubmit = () => {
      //提交前校验
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          // 将响应式对象转为普通对象
          const params = { ...leaveForm, action: action.value }
          const res = await proxy.$api.leaveOperate(params)
          proxy.$message.success('用户创建成功');
          handleClose()
          getLeaveList()
        }
      })
    }
    // 计算休假时间
    const handleDateChange = (key, val) => {
      let { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return
      if (startTime > endTime) {
        proxy.$message.error("开始时间不能晚于结束时间")
        leaveForm.leaveTime = "0天"
        setTimeout(() => {
          leaveForm[key] = ""
        })
      } else {
        leaveForm.leaveTime = ((endTime - startTime) / (24 * 60 * 60 * 1000) + 1) + "天"
      }
    }
    const handleCurrentChange = (val) => {
      pager.pageNum = val
      getLeaveList()
    }
    // 查看申请
    const handleDetail = (row) => {

      let data = { ...row }
      console.log(data);
      data.applyType = {
        1: "事假",
        2: "调休",
        3: "年假"
      }[data.applyType]
      data.time = `${utils.formateDate(new Date(row.startTime), 'yyyy-MM-dd')}到${utils.formateDate(new Date(row.endTime), 'yyyy-MM-dd')}`
      data.applyStateName = {
        1: '待审批',
        2: '审批中',
        3: '审批拒绝',
        4: '审批通过',
        5: '作废',
      }[data.applyState]
      detail.value = data
      showDetailModel.value = true
    }
    // 删除申请
    const handleDel = async (_id) => {
      try {
        let params = { _id, action: "delete" }
        // debugger
        let res = await proxy.$api.leaveOperate(params)
        proxy.$message.success("删除成功")
        getLeaveList()
      } catch (err) {
        console.log(err);
      }
    }
    return {
      columns, handleClose, handleApply, showModle,
      handleQuery, handleReset, pager, handleSubmit,
      queryForm, leaveList, leaveForm,
      handleCurrentChange, rules, handleDateChange, showDetailModel,
      handleDetail, handleDel, detail,
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
