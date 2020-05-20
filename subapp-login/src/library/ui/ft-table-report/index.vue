<template>
  <div class="ft-table-report">
    <!-- 按钮区 -->
    <el-row class="check-list" v-if="useCheckList">
      <el-col :span="21">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="item of selfCheckList"
            :key="item[selfProps.prop]"
            :label="item[selfProps.prop]"
            :checked="item[selfProps.checked]"
            :disabled="item[selfProps.disabled]"
          >{{item[selfProps.label]}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="3" class="align-right">
        <el-button
          plain
          class="btn"
          type="primary"
          icon="el-icon-ali-export iconfont"
          @click="exportClick"
        >导出</el-button>
      </el-col>
    </el-row>
    <!-- 列表区 -->
    <el-table border class="table-list" :data="selfData" :row-key="rowKey">
      <el-table-column v-if="hasIndex" width="55" type="index" label="序号"></el-table-column>
      <el-table-column
        v-for="i of selfColumns"
        :key="i[selfProps.prop]"
        :label="i[selfProps.label]"
        :prop="i[selfProps.prop]"
      >
        <template v-if="i._children">
          <el-table-column
            v-for="t of i._children"
            :key="t[selfProps.prop]"
            :label="t[selfProps.label]"
            :prop="t[selfProps.prop]"
          ></el-table-column>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ft-table-report",
  props: {
    useCheckList: {
      type: Boolean,
      default: true
    }, // 显示控制table列表的checkbox
    columns: Array, // 列表表头
    data: Array, // 列表表格数据
    props: Object, // 列表配置项
    rowKey: {
      // 优化行数据key
      type: String,
      default: "id"
    },
    hasIndex: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkList: [],
      selfColumnsList: []
    };
  },
  computed: {
    // 整理checkList数据
    selfCheckList() {
      if (!Array.isArray(this.columns)) return [];
      let _list = this.columns.reduce((pre, cur) => {
        return pre.concat(
          cur[this.selfProps.children] ? cur[this.selfProps.children] : cur
        );
      }, []);
      return _list;
    },
    // 整理配置项
    selfProps() {
      return {
        prop: "prop", // 字段名
        label: "label", // 列表显示名字段
        checked: "checked", // 字段名
        disabled: "disabled", // 禁用字段
        children: "children", // 多级表头
        ...this.props
      };
    },
    // 整理表格数据
    selfData() {
      return this.data || [];
    },
    // 整理表格表头
    selfColumns() {
      let _list = [];
      this.columns.forEach(i => {
        // 筛选二级表头
        if (i[this.selfProps.children]) {
          i._children = i[this.selfProps.children].filter(
            t => t[this.selfProps.checked]
          );
          if (i._children.length > 0) {
            _list.push(i);
          }
          return;
        }
        // 筛选一级表头
        if (i[this.selfProps.checked]) {
          _list.push(i);
        }
      });
      return _list;
    }
  },
  watch: {
    checkList(val) {
      this.selfCheckList.forEach(i => {
        i[this.selfProps.checked] = val.includes(i[this.selfProps.prop]);
      });
    }
  },
  methods: {
    exportClick() {
      this.$message("暂未开通，敬请期待");
    }
  }
};
</script>

<style lang="scss">
.ft-table-report {
  display: flex;
  flex-direction: column;
  .check-list {
    margin-bottom: 15px;
  }
  .table-list {
    flex: 1;
    height: 100%;
    th {
      text-align: center;
    }
  }
}
</style>