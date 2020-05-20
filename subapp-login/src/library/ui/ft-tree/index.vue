<template>
 <el-dialog
        title="选择明细物资"
        :visible="dialogVisible"
        width="90%"
        :before-close="close"
        center>
        <el-row>
            <el-col :span="14">
               <ft-scroll class="scroll">
                    <el-row slot="header" type="flex">
                        <el-col :span="8">
                            <p class="el-button--text">企业标准编码库</p>
                        </el-col>
                        <el-col :span="16" v-if="showSearch">
                            <el-form :inline="true">
                                <el-form-item>
                                    <el-input :v-model="searchData" placeholder="请输入物资名称" style="width:100%"  prefix-icon="el-icon-search" class="inlin-block"></el-input>
                                </el-form-item>
                                 <el-button type="warning" icon="el-icon-search" class="btn">搜索</el-button>
                            </el-form>
                        </el-col>
                    </el-row>
                    <el-row style="width: 100%">
                      <el-col :span="24/columns.length" v-for="column in columns" :key="column.prop">{{ column.label }}</el-col>
                    </el-row>
                    <el-tree
                        v-if="source1.length> 0"
                        :data="source1"
                        show-checkbox
                        :props="defaultProps"
                        @check-change="nodeSelected"
                        >
                        <el-row style="width:100%" slot-scope="{node, data}">
                          <el-col :span="24/columns.length" v-for="column in columns" :key="column.prop">{{ data[column.prop] }}</el-col>
                        </el-row>
                    </el-tree>
                    <el-tree 
                        ref="tree"
                        :data="source2"
                        show-checkbox
                   
                        :filter-node-method="materialTypeFilter"
                        :props="defaultProps"
                        @check-change="nodeSelected"
                        @node-expand="nodeExpend">

                        <el-row style="width:100%" slot-scope="{node, data}">
                          <el-col :span="24/columns.length" v-for="column in columns" :key="column.prop">{{ data[column.prop] }}</el-col>
                        </el-row>
                    </el-tree>
                </ft-scroll> 
            </el-col>
             <el-col :span="10">
                 <ft-scroll class="scroll">
                    <el-table :data="selectedData">
                        <el-table-column  v-if="hasIndex" type="index" width="55"></el-table-column>
                        <el-table-column 
                            v-for="column in columns" 
                            :key="column.id"
                            :prop="column.prop"
                            :label="column.label">
                        </el-table-column>
                    </el-table>
                 </ft-scroll>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click=" confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getMaterialDetails } from '@/api/plan-management.js';

export default {
    name: "ft-tree",
    props:{
        dialogVisible: {
            type: Boolean,
            default: function(){
                return false;
            }
        },
        source1:{//左侧树1(来自剩余量)
            type: Array,
            default:function(){
                return [];
            }
        },
        source2:{//左侧树2
            type: Array,
            default:function(){
                return [];
            }
        },
        defaultProps:{
            type: Object,
            default: function(){
                return {
                    children: 'children',
                    label: 'name',
                }
            }
        },
        hasIndex:{
            type: Boolean,
            default: function(){
                return true;
            }
        },
        columns:{
            type: Array,
            default: function(){
                return [];
            }
        },


    },
  data(){
      return {
        searchData: "",
        selectedData: [],
        cache: [],
        showSearch: true,
        data1: [],
        data2: [], 
      }
  },
  watch:{
    searchData(val){
      this.$refs.tree.filter(val);
    },
    source1(val){
      if(val.length>0){
        
        this.data1 = [{
          [columnKeys[0]]: "已选中"
        }, ...val]
        this.data2.unshift({ [columnKeys[0]]: "未选中"});
      }
    },
    source2(val){
      this.data2 = [this.data2, ...val];
    }
  },
  methods: {
      materialTypeFilter(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      confirm(){
         this.$emit('update:dialogVisible', false)
         this.$emit('dataSelected', JSON.parse(JSON.stringify( this.selectedData )) );
      },
      cancel(){
          this.$emit('update:dialogVisible', false)
      },
      close:function(){
          this.$emit('update:dialogVisible', false)
      },
      nodeSelected(data, selected){
          if( data.children === undefined ){
            if(selected && data.id){
                data.materialCode = data.code;
                this.cache[data.id] = data;
             }else{
                delete this.cache[data.id]
             }
          }

         this.selectedData = Object.values(this.cache)
      },
      loadNode(node, resolve){
        console.log(node)
      },
      nodeExpend(data, node){
          this.$emit("nodeExpend",data, node)
      }
  }
}
</script>

<style scoped lang="scss">
    .el-dialog__wrapper /deep/ .el-dialog__header{
        background: #0079e8  !important    ;
        padding: 10px !important;
    }
    .el-dialog__wrapper /deep/ .el-dialog__header /deep/.el-dialog__title,   .el-dialog__wrapper /deep/ .el-dialog__header /deep/.el-dialog__close{
         color: #fff;
    }
    .el-dialog__wrapper /deep/ .el-dialog__header /deep/.el-dialog__headerbtn{
        top: 13px;
    }
    .scroll{
        height: 60vh;
    }
</style>
