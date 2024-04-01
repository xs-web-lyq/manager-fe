<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu-create'">新增</el-button>
      </div>
      <!-- 树形数据是指数据中存在children时被认为是树形数据，展示树形数据需要配置row-key为数据的_id值，如果渲染数据的键值与要求字段不符合时通过:tree-props="{}"进行映射  -->
      <el-table class="table-info" :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :key="item.prop" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(2, scope.row)" v-has="'menu-create'">新增</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-has="'menu-edit'">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)" v-has="'menu-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增用户" v-model="showModle">
      <el-form ref="logoForm" :model="menuForm" label-width="100" :rules="rules">
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
    this.getMenuList()
  },
  data() {
    return {
      showModle: false,
      action: 'add',
      queryForm: {
        menuState: 1,
        menuName: ''
      },
      menuList: [],
      menuForm: {
        parentId: [null],
        menuType: 1,
        menuState: 1
      },
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8字符",
            trigger: 'blur'
          }
        ]
      },

      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 180
        }, {
          label: "图标",
          prop: "icon"
        }, {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: '菜单',
              2: "按钮"
            }[value]
          }

        },
        {
          label: "权限标识",
          prop: "menuCode"

        },
        {
          label: "路由地址",
          prop: "path"
        },
        {
          label: "组件路径",
          prop: "component"
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: '正常',
              2: "停用"
            }[value]
          }
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(roe, column, value) {
            return utils.formateDate(new Date(value))
          }
        },
      ]
    }
  },
  methods: {
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList(this.queryForm)
        this.menuList = list
        this.handleReset("queryForm")
      } catch (err) {
        console.log(err);
      }

    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleAdd(type, row) {
      this.showModle = true
      this.action = 'add'
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        )
      }
    },
    handleEdit(row) {
      this.showModle = true
      this.action = 'edit'
      // 在默认数据挂载完毕之后，将数据在进行响应式赋值上去，防止恢复出现问题
      this.$nextTick(() => {
        Object.assign(this.menuForm, row)
      })
    },
    async handleDel(_id) {
      await this.$api.menuSubmit({ _id, action: 'delete' })
      this.$message.success("删除成功")
      this.getMenuList()
    },
    //弹框关闭
    handleClose() {
      this.showModle = false
      this.handleReset('logoForm')
    },
    // 提交
    handleSubmit() {
      this.$refs.logoForm.validate(async (valid) => {
        if (valid) {
          let { action, menuForm } = this;
          let params = { ...menuForm, action }
          let res = await this.$api.menuSubmit(params)
          this.showModle = false
          this.$message.success('操作成功')
          this.handleReset('logoForm')
          this.getMenuList()
        }
      })
    }

  }


}
</script>
<style lang='scss' scoped>
.user-manage {
  height: 100%;
  overflow-y: auto;
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

  .table-info {
    max-height: calc(100vh - 180px);
    overflow-y: scroll;
  }
}

.pagination {
  justify-content: flex-end;
  padding: 8px 20px;
}
</style>
