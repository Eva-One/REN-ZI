<template>
  <el-dialog
    :title="`${roleForm.id ? '修改' : '新增'}角色`"
    width="40%"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{required:true, message:'请输入角色',trigger:'blur'}]"
      >
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submitRole() {
      try {
        this.loading = true
        await this.$refs.roleDialogForm.validate()
        this.roleForm.id ? await updateRole(this.roleForm) : await addRole(this.roleForm)
        this.$parent.getRoleList()
        this.$message.success(`${this.roleForm.id ? '修改角色' : '新增角色'}成功`)
        this.handleClose()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
