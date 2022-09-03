<template>
  <div class="app-container">
    <PageTools type="success">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button v-if="checkPermission('EMPLOYEES_EXPORT_ENTRY')" size="small" type="warning" @click="$router.push('/import/?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img v-imgError="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" @click="showCode(row.staffPhoto)">
          </template>
        </el-table-column>

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
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          v-if="total>0"
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

    <AddEmployee :show-dialog.sync="dialogShow" @refresh="getEmployeeList" />

    <el-dialog title="头像二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas id="myCanvas" />
      </el-row>
    </el-dialog>

    <AssignRole ref="roleList" v-model="showAssignRole" :user-id="currentId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import employeesForm from '@/api/constant/employees'
import AddEmployee from './components/AddEmployee.vue'
import AssignRole from './components/AssignRole.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      dialogShow: false,
      loading: false,
      showCodeDialog: false,
      showAssignRole: false,
      currentId: null
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { total, rows } = await getEmployeeList(this.page)
        this.total = total
        this.list = rows
        if (total !== 0 && rows.length === 0) {
          this.page.page--
          this.getEmployeeList()
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
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
    },
    async del(id) {
      try {
        await this.$confirm('删除该员工信息？',
          { type: 'warning' }
        )
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (e) {
        console.log(e)
      }
    },
    async showCode(url) {
      if (url) {
        this.showCodeDialog = true
        await this.$nextTick()
        QrCode.toCanvas(document.querySelector('#myCanvas'), url)
      }
    },

    async showRole(id) {
      await this.$refs.roleList.getRoleList()
      this.currentId = id
      this.showAssignRole = true
    },

    async exportData() {
      const { rows } = await getEmployeeList({
        page: 1, size: this.total
      })
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }

      import('@/vendors/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: this.fromJson(rows, headers), // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader: [['姓名', '主要信息', '', '', '', '', '']],
          merges: ['A1:A2', 'B1:G1']
        })
      })
    },
    fromJson(rows, headers) {
      // const arr = []
      // rows.forEach(ele => {
      //   const arr1 = []
      //   Object.keys(headers).forEach(key => {
      //     arr1.push(ele[headers[key]])
      //   })
      //   arr.push(arr1)
      // })

      return rows.map(ele => Object.keys(headers).map(key => {
        if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
        // 格式化日期 -> 已经定义过过滤器直接使用即可
          return formatDate(ele[headers[key]])
        } else if (headers[key] === 'formOfEmployment') {
        // 需要引入employeesForm常量进行处理
          // const obj = employeesForm.hireType
          const obj = employeesForm.hireType.find(obj => obj.id === +ele[headers[key]])
          return obj ? obj.value : '非正式'
        }
        return ele[headers[key]]
      }))
    }
  }
}
</script>

<style>

</style>
