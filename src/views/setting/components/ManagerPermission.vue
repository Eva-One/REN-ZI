<template>
  <el-dialog
    title="分配权限"
    :visible="dialogVisible"
    :before-close="handleClose"
  >
    <el-tree
      ref="permTree"
      :data="permData"
      default-expand-all
      show-checkbox
      :props="defaultProps"
      check-strictly
      :default-checked-keys="selectedKeys"
      node-key="id"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="assignSure">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { getRoleDetail, assignPerm } from '@/api/setting'
import { changeArrToTree } from '@/utils'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permData: [],
      selectedKeys: [],
      //   permData: [
      //     {
      //       code: 'employees',
      //       description: '用户管理菜单',
      //       enVisible: '1',
      //       id: '604f7df5f900be1850edb152',
      //       name: '员工管理',
      //       pid: '0',
      //       type: 1,
      //       children: [
      //         {
      //           code: '214234',
      //           description: '412214',
      //           enVisible: '0',
      //           id: '62f0d56637ecc10a881557f5',
      //           name: '智商250',
      //           pid: '604f7df5f900be1850edb152',
      //           type: 2
      //         }
      //       ]
      //     }
      //   ],
      defaultProps: {
        label: 'name'
      },
      userId: null,
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.selectedKeys = []
    },
    async getPermissionList(id) {
      try {
        this.userId = id
        const res = await getPermissionList()
        const { permIds } = await getRoleDetail(id)
        this.permData = changeArrToTree(res, '0')
        this.selectedKeys = permIds
      } catch (e) {
        console.log(e)
      }
    },
    async assignSure() {
      try {
        this.loading = true
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.userId })
        this.handleClose()
        this.$message.success('角色权限分配成功')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
