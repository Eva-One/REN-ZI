<template>
  <div class="app-container">
    <el-card>
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <!-- 放置表单 -->
          <el-form ref="form" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="userInfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input v-model="userInfo.password2" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserDetailById">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <UserInfo ref="userInfo" />
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <JobInfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userInfo: {
        //   专门存放基本信息
        username: '',
        password: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名必填', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 9, message: '密码格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.$route.params.id)
      this.$refs.userInfo.userInfo = { ...this.userInfo }
    },
    async saveUserDetailById() {
      try {
        await this.$refs.form.validate()
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        this.$message.success('信息更新成功')
      } catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style>

</style>
