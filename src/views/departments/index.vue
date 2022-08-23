<template>
  <div v-loading="loading" class="departments-container">
    <el-card class="tree-card">
      <tree-tool :tree-node="company" @add="addDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tool slot-scope="{data}" :tree-node="data" :is-root="true" @add="addDept" @edit="editDept" @refreshDept="getDepartments" />
    </el-tree>
    <add-dept ref="addDept" :visible-dialog.sync="dialogVisible" :current-node="currentNode" @refreshDept="getDepartments" />
  </div>
</template>

<script>
import TreeTool from './components/TreeTool.vue'
import AddDept from './components/AddDept.vue'
import { getDepartments } from '@/api/departments'
import { changeArrToTree } from '@/utils'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: {
      },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = changeArrToTree(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
      this.loading = false
    },
    addDept(node) {
      this.currentNode = node
      this.dialogVisible = true
    },
    editDept(node) {
      this.currentNode = node
      this.dialogVisible = true
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
