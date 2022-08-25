<template>
  <div class="app-container">
    <PageTools type="success">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="sc">
            {{ sc.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState===1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next,total,sizes"
          background
          :total="total"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="page.size"
          @current-change="handleCurrentChange"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>

    <AddEmployee :show-dialog.sync="dialogShow" />
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import employeesForm from '@/api/constant/employees'
import AddEmployee from './components/AddEmployee.vue'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      dialogShow: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      try {
        const { total, rows } = await getEmployeeList(this.page)
        this.total = total
        this.list = rows
      } catch (e) {
        console.log(e)
      }
    },
    formatEmployment(row, column, cellValue, index) { // row代表这一行的数据 column代表这一行每个格子的信息 cellValue代表当前这个格子的值 index 代表当前索引
      const form = employeesForm.hireType.find(ele => ele.id === cellValue * 1)
      // return form ? form.value : '非正式'
      return form?.value ?? '非正式'
    },
    handleCurrentChange() {
      this.getEmployeeList()
    },
    add() {
      this.dialogShow = true
    }
  }
}
</script>

<style>

</style>
