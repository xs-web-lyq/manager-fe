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
      <el-table :data="leaveList">
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <!-- 当当前审批人为当前账号人时并且处于待审核和审核中时才可以显示审核按钮 -->
            <el-button type="primary" @click="handleDetail(scope.row)"
              v-if="scope.row.curAuditUserName == userInfo.userName && [1, 2].includes(scope.row.applyState)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="pager.total"
        :page-size="pager.pageSize" v-model:current-page="pager.pageNum" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="审核" width="50%" v-model="showDetailModel" destroy-on-close>

      <el-form :model="auditForm" :rules="rules" ref="dialogForm" label-width="120px" label-suffix=":">
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
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
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="3" placeholder="请添加备注" v-model="auditForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleApprove('pass')">审核通过</el-button>
          <el-button type="danger" @click="handleApprove('refuse')"> 驳回</el-button>
        </span>
      </template>
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
      remark: [
        {
          required: true,
          message: "请输入审核备注",
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
        label: '申请人',
        // formatter() {
        //   return detail.value.applyUser.userName
        // }
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
    const userInfo = proxy.$store.state.userInfo
    // 进度弹框展示
    const showDetailModel = ref(false)
    // auditForm
    const auditForm = reactive({ remark: '通过' })

    onMounted(() => {
      getLeaveList()
    })
    // 获取用户列表
    const getLeaveList = async () => {
      let params = { ...queryForm, ...pager, type: 'approve' }
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
      console.log(detail);
      showDetailModel.value = true
    }
    const handleApprove = (action) => {
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let params = { action, remark: auditForm.remark, _id: detail.value._id }
          try {
            let res = await proxy.$api.leaveApprove(params)
            showDetailModel.value = false
            proxy.$message.success("处理成功")
            handleReset("dialogForm")
            getLeaveList()
            // 因为这里审核需要修改count值所以使用vuex管理count值比较的合适
            proxy.$store.commit("saveNoticeCount", proxy.$store.state.noticeCount - 1)

          } catch (err) {

          }

        }
      })
    }
    return {
      columns, handleReset, pager, handleQuery, auditForm,
      queryForm, leaveList, handleApprove,
      handleCurrentChange, rules, handleDateChange, showDetailModel,
      handleDetail, detail, userInfo
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
