<template>
  <el-dialog
    title="分配角色"
    :visible="value"
    :before-close="handleClose"
  >
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" :loading="loading" @click="assignRoles">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'HrsaasAssignRole',
  inheritAttrs: false,
  model: {
    event: 'update'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  watch: {
    value(val) {
      if (val === true) {
        this.getUserDetailById()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update', false)
      this.roleIds = []
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      this.roleList = rows
    },
    async getUserDetailById() {
      const res = await getUserDetailById(this.$attrs['user-id'])
      this.roleIds = res.roleIds || []
      console.log(res)
    },
    async assignRoles() {
      try {
        this.loading = true
        await assignRoles({ id: this.$attrs['user-id'], roleIds: this.roleIds })
        this.$message.success('更新成功')
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
