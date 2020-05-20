<template>
  <div>
    <input type="file" @change="uploads($event)" :id="id" style="display: none;" multiple/>
    <el-button type="primary"  :icon="icon" @click="uploadFile">点击上传</el-button>
    <ul class="el-upload-list el-upload-list--text" v-if="fjs.length > 0 && isShowList && isShowFjList">
      <li v-for="(item, index) of fjs" :key="index" class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name">
          <i class="el-icon-document"></i>
          {{item.file.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close" @click="removeClick(item)"></i>
      </li>
     </ul>
  </div>
</template>

<script>
/**
 * auth fndbs1314
 * des 上传文件 (多文件上传)
 * @props id 标签标志
 * @props isShowFjList 是否显示附件 默认为true
 * @props lastSn 上次上传的sn码
 * @props icon 上传按钮图标
 * @props uploadUrl 上传路径 /user/file/uploads
 * @props removeUrl 删除路径 /user/file/removeById/
 * @emit sn: 返回sn
 */
import axios from 'axios';
export default {
  name: 'FtUpload',
  props: {
    id: {
      type: String,
      default: 'files'
    },
    isShowFjList: {
      type: Boolean,
      default: true
    },
    lastSn: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ""
    },
    uploadUrl: {
      type: String,
      required: true
    },
    removeUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fjs: [],
      isShowList: false,
      newSn: ''
    }
  },
  mounted () {
    this.fjs = [];
    if (this.lastSn) {
      this.getQueryBySn(this.lastSn);
    }
  },
  methods: {
    // 根据sn码查询文件
    getQueryBySn (sn) {
      if (sn && this.isShowFjList) {
        this.$api.project.getQueryBySn(sn).then(res => {
          if (res.code === "0000") {
            this.isShowList = true;
            this.fjs = res.data.map(item => {
              return {
                file: {
                  name: item.filename,
                  id: item.id
                }
              }
            });
          } else {
            this.$message.error(res.message);
          }
        }).catch(err => {
          this.$message.error('查询失败');
        })
      }
    },
    uploadFile(row) {
      var file = document.getElementById(this.id);
        file.click();
    },
    uploads(e) {
      for (let file of e.target.files) {//多文件上传
        let data = {
          file: file,
        };
        this.fjs.push(data);
      }
      let formData = new FormData();

      if (this.fjs.length > 0) {
        this.fjs.forEach(file => {
          if (file.file && file.file.id) {
          } else {
            let newFile = new File([file.file], encodeURIComponent(file.file.name));
            formData.append(`file`, newFile);
          }
        });
        if (this.newSn) {
          formData.append('sn', this.newSn);
        } else {
          if (this.lastSn) {
            formData.append('sn', this.lastSn);
          }
        }
        if (this.fjs.length > 0) {
          let _url = this.uploadUrl;//上传文件接口地址
          axios({
            url: _url,
            method: 'post',
            data: formData,
          }).then(res => {
            if (res.code === "0000") {
              this.newSn = res.data[0].sn;
              this.$emit('sn', res.data[0].sn);
              this.$message.success(`上传成功`);
              this.getQueryBySn(this.newSn);
              this.isShowList = true
            } else {
              this.$message.error(`上传失败`);
              this.fjs.pop();
              this.isShowList = false
            }
          }).catch(err => {
            this.fjs.pop();
            this.$message.error(`上传失败`);
            this.isShowList = false;
          })
        }
      }
    },
    removeClick(row) {
      let _url = this.removeUrl + row.file.id; // 删除文件接口地址
      axios({
        url: _url,
        method: 'get'
      }).then(res => {
        if (res.code === "0000") {
          this.$message.success(`删除成功`);
          let sn = this.newSn ? this.newSn : this.lastSn;
          this.getQueryBySn(sn);
        } else {
          this.$message.error(`删除失败`);
        }
      }).catch(err => {
        this.$message.error(`删除失败`);
      })
    }
  },
  watch: {
    lastSn: function (newVal, val) {
      if (newVal) {
        this.getQueryBySn(this.lastSn);
      }
    }
  },
  beforeDestroy () {
    this.fjs = []
  }
}
</script>

<style>

</style>