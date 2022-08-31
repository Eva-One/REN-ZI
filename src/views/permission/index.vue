<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools :show-before="false">
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPer('0', 1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table v-loading="loading" border :data="list" row-key="id" default-expand-all>
        <el-table-column label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type*1===1" type="text" icon="el-icon-circle-plus-outline" style="color:green" @click="addPer(row.id,2)">添加</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="editPer(row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" style="color:red" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <AddPermission ref="addPer" :dialog-visible.sync="dialogVisible" @getPermissionList="getPermissionList" />
  </div>
</template>

<script>
import PageTools from '@/components/PageTools'
import AddPermission from './components/AddPermission.vue'
import { getPermissionList, delPermission } from '@/api/permisson'
import { changeArrToTree } from '@/utils'
export default {
  components: {
    PageTools,
    AddPermission
  },
  data() {
    return {
      list: [],
      loading: false,
      dialogVisible: false
    }
  },
  mounted() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      try {
        this.loading = true
        const res = await getPermissionList()
        this.list = changeArrToTree(res, '0')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async del(id) {
      try {
        await this.$confirm('确认删除该权限', '提示', {
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (e) {
        console.log(e)
      }
    },
    addPer(pid, type) {
      this.$refs.addPer.formData.pid = pid
      this.$refs.addPer.formData.type = type
      this.dialogVisible = true
    },
    editPer(row) {
      this.$refs.addPer.formData = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>
