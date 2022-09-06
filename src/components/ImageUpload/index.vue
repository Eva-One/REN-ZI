<template>
  <div>
    <el-upload
      v-loading="loading"
      :class="fileList.length === limit ? 'hideAdd' : ''"
      :limit="limit"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="change"
      action="#"
      :http-request="upload"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
    >
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>

</template>
<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: '',
  SecretKey: ''
})
console.log(cos)

export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fileList: [],
      previewImgDialogVisible: false,
      imgUrl: '',
      loading: false
    }
  },
  methods: {
    change(file, filelist) {
      this.fileList = filelist
    },
    upload(data) {
      this.loading = true
      cos.putObject({
        Bucket: 'harss-32-1313544758', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        this.loading = false
        console.log(err || data)
        if (err || data.statusCode !== 200) {
          return this.$message.error('图片上传失败，请重试')
        }
        this.$emit('onSuccess', { 'url': `https://` + data.Location })
      })
    },
    onRemove(file, filelist) {
      console.log(file)
      this.fileList = filelist
    },
    onPreview(file) {
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      const fileType = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!fileType.includes(file.type)) {
        this.$message.error(`图片格式只能为${fileType.join('')}`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('图片大小限制为5MB')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
.hideAdd .el-upload--picture-card {
  display: none;
}
</style>
