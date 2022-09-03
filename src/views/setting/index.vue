<template>
  <div class="app-container">
    <el-tabs v-model="activeName" v-loading="loading">
      <el-tab-pane label="角色管理" name="first">
        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="handleAdd"
          >新增角色</el-button>
        </el-row>

        <!-- 表格 -->
        <el-table border="" :data="list">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="角色名称" width="180" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="assignPer(scope.row)">分配权限</el-button>
              <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <el-pagination
            background
            layout="total,prev, pager, next,sizes"
            :total="total"
            :current-page.sync="page.page"
            :page-size.sync="page.pagesize"
            :page-sizes="[5, 10, 15, 20]"
            @current-change="changePage"
            @size-change="changeSize"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="消息提示的文案"
          type="info"
          show-icon
        />
        <el-form label-width="120px" style="margin-top:50px" :model="formData">
          <el-form-item label="公司名称">
            <el-input v-model="formData.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

    </el-tabs>

    <role-dialog ref="dialog" :dialog-visible.sync="dialogVisible" />

    <ManagerPermission ref="managePer" :dialog-visible.sync="dialogVisible1" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import RoleDialog from './components/RoleDialog.vue'
import ManagerPermission from './components/ManagerPermission.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    RoleDialog,
    ManagerPermission
  },
  data() {
    return {
      activeName: 'first',
      page: { page: 1, pagesize: 10 },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: {},
      dialogVisible1: false
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.list = rows
        this.total = total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    changePage() {
      this.getRoleList()
    },
    changeSize() {
      this.getRoleList()
    },
    handleAdd() {
      this.dialogVisible = true
    },
    edit(row) {
      this.dialogVisible = true
      this.$refs.dialog.roleForm = { ...row }
    },
    async del(id) {
      // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
      try {
        await this.$confirm('此操作将删除角色, 是否继续?', '提示', { type: 'warning' })
        await deleteRole(id)
        this.$message.success('角色删除成功')
        this.page.page = 1
        this.getRoleList()
      } catch (e) {
        console.log(e)
      }
    },
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      this.formData = res
    },
    async assignPer(row) {
      await this.$refs.managePer.getPermissionList(row.id)
      this.dialogVisible1 = true
    }
  }
}
</script>

<style>

</style>
