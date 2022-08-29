<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:</div>
    <!-- <UploadExcel :before-upload="btnUpload" /> -->
    <a href="http://mrdu-68-1313504142.cos.ap-nanjing.myqcloud.com/%E7%9A%AE%E5%8D%A1%E4%B8%98.jpg" download="touxiang.jpg">点击下载</a>
    <UploadImg @onSuccess="success" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
    ])
  },
  mounted() {
  },
  methods: {
    // btnUpload(file) {
    //   if (file.size > 1024) {
    //     this.$message.error('大小超过限制')
    //     return false
    //   }
    //   return true
    // },
    success({ url }) {
      console.log(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
