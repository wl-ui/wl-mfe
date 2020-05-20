<template>
  <div class="upload-test">
    <input type="file" @change="uploads($event)" :id="id" style="display: none;" multiple/>
    <el-button type="primary" :icon="icon" @click="uploadFile">点击上传</el-button>
    <div style="margin-top:6px">
      <ul class="el-upload-list el-upload-list--picture-card" v-if="showImages.length > 0 && isShowList && isShowFjList">
        <li  v-for="(item, index) of showImages" :key="index" class="el-upload-list__item is-success">
          <img :src="item.newUrl" alt="" class="el-upload-list__item-thumbnail">
          <a class="el-upload-list__item-name">
            <i class="el-icon-document"></i>
            {{item.name}}
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
          </label>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview">
              <i class="el-icon-zoom-in" @click="zoomImg(item)"></i>
            </span>
            <span class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="removeClick(item)"></i>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <el-dialog :visible.sync="isShowImg" append-to-body title="图片">
      <img :src="bigImgUrl" alt="">
    </el-dialog>
    
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
  name: 'FtUploadImg',
  props: {
    id: {
      type: String,
      default: 'files'
    },
    isShowFjList: {
      type: Boolean,
      default: true
    },
    lastSn: { // 上次已有的sn码
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
      newSn: '',
      showImages: [], // 显示的图片列表
      isShowImg: false,
      bigImgUrl: ""
    }
  },
  mounted () {
    this.fjs = [];
    this.showImages = [];
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
            this.showImages = res.data.map(item => {
              return {
                newUrl: item.trackerUrl + item.path,
                id: item.id
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
      this.fjs = [];
      // this.isShowList = false;
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
      let self = this;
      if (this.fjs.length > 0) {
        this.fjs.forEach(file => {
          let newFile = new File([file.file], encodeURIComponent(file.file.name));
          formData.append(`file`, newFile);
          let fileUrl = window.URL.createObjectURL(file.file);
          // self.showImages.push({newUrl: fileUrl, name: file.name});
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
              this.isShowList = true;
              this.getQueryBySn(this.newSn);
            } else {
              this.fjs.pop();
              this.$message.error(`上传失败`);
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
      let _url = this.removeUrl + row.id; // 删除文件接口地址
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
    },
    zoomImg(row) {
      this.bigImgUrl = row.newUrl;
      this.isShowImg = true;
    }
  },
  watch: {
    lastSn: function (val) {
      if (val) {
        this.getQueryBySn(this.lastSn);
      }
    }
  },
  beforeDestroy () {
    this.fjs = [];
    this.showImages = [];
  }
}
</script>

<style>
.upload-test .el-upload-list--picture-card .el-upload-list__item {width: 70px;height: 70px;}
</style>