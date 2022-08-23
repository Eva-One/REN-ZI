<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <tree-tool :tree-node="company" @add="addDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tool slot-scope="{data}" :tree-node="data" :is-root="true" @add="addDept" />
    </el-tree>
    <add-dept :visible-dialog.sync="dialogVisible" :current-node="currentNode" />
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
      currentNode: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { depts, companyName, companyManage } = await getDepartments()
      this.departs = changeArrToTree(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
    },
    addDept(node) {
      this.currentNode = node
      this.dialogVisible = true
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
