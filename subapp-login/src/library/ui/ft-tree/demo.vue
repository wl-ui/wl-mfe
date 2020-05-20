<template>
  <section class="demo">
    <ft-tree @nodeExpend="nodeExpend" :source1="planMaterialData" :source2="materialTypeData" :dialogVisible.sync="dialogVisible" :columns="columns" @dataSelected="dataSelected" ></ft-tree>
    
  </section>
</template>

<script>
import {getMaterialType,getPlanMaterial,getMaterialDetails} from '@/api/plan-management.js';
export default {
 name: 'demo',
  props:{
      dialogVisible:{
          type: Boolean,
          default: function(){
              return false;
          }
      }
  },
  data() {
    return {
        planMaterialData:[],
        materialTypeData:[],
        columns:[
            {prop: 'name', label: "物资名称"},
            {prop: 'code', label:"物资编码"},
            {prop: 'specification', label:"规格"},
            {prop: 'type', label:"型号"},
            {prop: 'unit', label:"单位"},
        ],
    }
  },
  mounted() {
      this.getPlanMaterial();
      this.getMaterialType();
  },
  methods: {
      nodeExpend( data, node ){
          getMaterialDetails({catCode: data.code})
            .then(res=>{
                if(res.data && res.data.code === "0000"){
                    let d =  res.data.data;
                    if(!this.isArray(d)) return;
                   
                    for(let i = d.length - 1; i >= 0; i--){
                        let flag =  data.children.some(item=>{return item.id === d[i].id;});
                        if(!flag) {
                            if(JSON.stringify(data.children[0]) === "{}") data.children = [];
                            data.children.unshift( d[i] );
                        }
                    }

                }else{
                    this.$message({
                        type: "warning",
                        message: res.data.message
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            })
     },
     dataSelected(val){
         this.$emit('dataSelected', value)
     },
    getPlanMaterial(){
        getPlanMaterial({projectCode: this.formData.projectCode})
        .then(res=>{
            if(res.data && res.data.code === "0000"){
                this.deepForEach(res.data.data, function(item, array){
                    if(item.children && item.children.length == 0) item.children = [{}]
                })  
                this.planMaterialData = res.data.data;
            }else{
                this.$message({
                    type: "warning",
                    message: res.data.message
                })
            } 
        })
        .catch(error=>{
            this.$message({
            type: "warning",
            message: "查询总计划余量失败"
            })
        })
     },
     getMaterialType(){
        getMaterialType()
        .then(res=>{
            if(res.data && res.data.code === "0000"){
                this.deepForEach(res.data.data, function(item, array){
                    if(item.children && item.children.length == 0) item.children = [{}]
                })
                this.materialTypeData = res.data.data;
            }else{
                this.$message({
                    type: "warning",
                    message: res.data.message
                })
            } 
        })
        .catch(error=>{
            this.$message({
            type: "warning",
            message: "查询物资类型失败"
            })
        })
     },
     
  }
}
</script>
