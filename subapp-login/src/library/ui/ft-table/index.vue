<template>
  <div class="ft-table">
    <!-- table表格 -->
    <el-table
      border
      fitstripe
      class="ld-table"
      ref="tableRef"
      size="mini"
      :data="data"
      :height="height"
      :span-method="spanMethod"
      :sum-text="sumText"
      :show-summary="showSummary"
      :row-class-name="rowClassName"
      :summary-method="summaryMethod"
      :cell-class-name="cellClassName"
      :highlight-current-row="highlightCurrentRow"
      :header-row-class-name="selfHeaderRowClassName"
      :load="load"
      :lazy="lazy"
      :row-key="rowKey"
      :tree-props="treeProps"
      :default-expand-all="defaultExpandAll"
      @selection-change="selectionChange"
      @row-dblclick="rowdblClick"
      @row-click="handleRowClick"
      @select="select"
      :row-style="rowStyle"
      :cell-style="cellStyle"
    >
      <!-- 选择框CheckBox列 -->
      <el-table-column
        v-if="hasCheck"
        align="center"
        type="selection"
        width="50"
        :selectable="selectable"
      ></el-table-column>
      <!-- 序号index列 -->
      <el-table-column
        v-if="hasIndex"
        label="序号"
        align="center"
        type="index"
        width="50"
        :show-overflow-tooltip="true"
        :index="indexFormat"
      ></el-table-column>
      <!-- 列配置 -->
      <template v-for="column in columns">
        <el-table-column
          v-if="column.slot"
          :key="column.prop"
          :type="column.type"
          :column-key="column.columnKey"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
          :sort-orders="column.sortOrders"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :header-align="column.headerAlign"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
        >
          <template slot-scope="scope">
            <slot :name="column.prop" :row="scope.row" :index="scope.$index"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="column.prop"
          :column-key="column.columnKey"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
          :sort-orders="column.sortOrders"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align || 'center'"
          :header-align="column.headerAlign"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
        ></el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <div v-if="pagination" class="pagination-container">
      <el-pagination
        background
        hide-on-single-page
        layout="total, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
      ></el-pagination>
    </div>
    <div class="clearfix"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { localSet, localGet } from "@/library/js/storage";

export default {
  name: "FtTable",
  data() {
    return {
      // activeRow: {}, // 当前选中行
      selectionList: [] // 多选选中数据
    };
  },
  props: {
    defaultExpandAll: {
      //是否展开
      type: Boolean,
      default: function() {
        return false;
      }
    },
    //表格数据
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /* 表格额外的列配置数据:
        fixed | 'left','true','right' | 列是否固定,默认值:'';
        prop | 数据对象中的属性;
        label | 表头文字;
        align | 'left', 'center', 'right' | 对齐方式,默认值:'left';
        width | 列宽;
        minWidth | 列最小宽度;
        sortable | true, false | 是否排序,默认值:false;
        formatter | Function | 格式化函数;
        showOverflowTooltip | true,false | 内容溢出是,用...表示,默认值:true;
        className | 列的样式类名;
        */
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //行的 className 的回调方法
    rowClassName: {
      type: Function,
      default: null
    },
    //单元格的 className 的回调方法
    cellClassName: {
      type: Function,
      default: null
    },
    // 表头行class
    headerRowClassName: String,
    //当前行是否高亮
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    //是否显示复选框
    hasCheck: {
      type: Boolean,
      default: false
    },
    // 多选时，是否可以点击行快速选中复选框
    quickCheck: {
      type: Boolean,
      default: false
    },
    //是否显示序号
    hasIndex: {
      type: Boolean,
      default: true
    },
    // 行数据的 Key，用来优化 Table 的渲染
    rowKey: {
      type: String,
      default: "id"
    },
    //是否在表尾显示合计行
    showSummary: {
      type: Boolean,
      default: false
    },
    //合计行第一列的文本
    sumText: {
      type: String,
      default: "合计"
    },
    //自定义的合计计算方法
    summaryMethod: {
      type: Function,
      default: null
    },
    //行单击事件
    rowClick: {
      type: Function,
      default: function() {}
    },
    //行双击事件
    rowdblClick: {
      type: Function,
      default: function() {}
    },
    // 是否懒加载子节点数据
    lazy: {
      type: Boolean
    },
    // 加载子节点数据的函数，lazy 为 true 时生效
    load: {
      type: Function
    },
    //表格的高度
    height: [Number, String],
    //是否分页
    pagination: {
      type: Boolean,
      default: true
    },
    //表格数据总条数
    total: {
      type: Number,
      default: 0
    },
    //当前页数
    pageNum: {
      type: Number,
      default: 1
    },
    //每页显示几条数据
    pageSize: {
      type: Number,
      default: function() {
        return this.PAGESIZE;
      }
    },
    pageSizes: Array,
    //自定义的某行是否可以勾选
    selectable: {
      type: Function,
      default: null
    },
    rowStyle: {
      type: Function,
      default: null
    },
    cellStyle: {
      type: Function,
      default: null
    },
    spanMethod: {
      type: Function,
      default: null
    },
    treeProps: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 多选时默认选中行
    defaultChecked: [Array, Object]
  },
  computed: {
    selfHeaderRowClassName() {
      return `ft-thead ${this.headerRowClassName || ""}`;
    },
    ...mapGetters({ PAGESIZE: "size" })
  },
  watch: {
    defaultChecked(val) {
      this.setDefaultCheck(val);
    }
  },
  created() {
    let localPageSize = localGet("pageSize");
    if (localPageSize) {
      this.setPageSize(localPageSize);
    }
    this.setDefaultCheck(this.defaultChecked);
  },
  methods: {
    //单元格单击事件
    cellClick(row, column, cell, event) {
      if (column.type != "index" && column.type != "selection") {
        this.$emit("cellClick", row, column, cell, event);
      }
    },
    //每页条数change
    handleSizeChange(size) {
      this.$emit("size-change", size);
      this.$refs["tableRef"].bodyWrapper.scrollTop = 0;
      this.setPageSize(size);
      localSet("pageSize", size);
    },
    //当前页数change
    handleCurrentChange(currentPage) {
      this.$emit("current-change", currentPage);
      this.$refs["tableRef"].bodyWrapper.scrollTop = 0;
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件， 注意会多输出一个字段表示是选中还是取消选中
    select(selection, row) {
      let _is_add = selection.some(i => i[this.rowKey] === row[this.rowKey]);
      this.selectionList = selection;
      this.$emit("select", selection, row, _is_add);
    },
    //当选择项发生变化时会触发该事件
    selectionChange(selections) {
      this.selectionList = selections;
      this.$emit("selection-change", selections);
    },
    //用于多选表格，清空用户的选择
    clearSelection() {
      this.$refs.tableRef.clearSelection();
    },
    // 行点击事件
    handleRowClick(row) {
      if (this.hasCheck && this.quickCheck) {
        let selected = this.selectionList.some(
          i => i[this.rowKey] == row[this.rowKey]
        );
        this.toggleRowSelection(row, !selected);
        this.$nextTick(() => {
          this.select(this.selectionList, row, !selected);
        });
      }
      this.$emit("row-click", row);
      this.rowClick && this.rowClick();
    },
    //index序号格式化
    indexFormat(index) {
      if (this.pagination && this.pageNum && this.pageSize) {
        return (this.pageNum - 1) * this.pageSize + (index + 1);
      } else {
        return index + 1;
      }
    },
    // 默认选中
    setDefaultCheck(val) {
      this.$nextTick(() => {
        if (Array.isArray(val)) {
          val.forEach(i => {
            this.toggleRowSelection(i, true);
          });
          return;
        }
        if (this.isObject(val)) {
          this.setCurrentRow(val);
        }
      });
    },
    // ------------------------------------------------一下为提供方法-------------------------------------------
    // 设置单行选中方法
    setCurrentRow(row) {
      this.$refs["tableRef"].setCurrentRow(row);
    },
    // 设置单行选中方法
    toggleRowSelection(row, selected) {
      this.$refs["tableRef"].toggleRowSelection(row, selected);
    },
    // 设置数表的行展开状态
    toggleRowExpansion(row, expanded = true) {
      this.$refs["tableRef"].toggleRowExpansion(row, expanded);
    },
    /**
     * 手动调用树表懒加载
     * row 要展开的行信息
     */
    loadTree(row) {
      this.$refs["tableRef"].store.loadOrToggle(row);
    },
    /**
     * 更新树表懒加载后的子节点
     * 要更新的节点id
     * 要添加的节点data
     */
    loadTreeAdd(id, data) {
      let _children =
        this.$refs["tableRef"].store.states.lazyTreeNodeMap[id] || [];
      _children.unshift(data);
      this.$set(
        this.$refs["tableRef"].store.states.lazyTreeNodeMap,
        id,
        _children
      );
    },
    /**
     * 更新树表懒加载后的子节点
     * 要更新的节点id
     * 要删掉的字节的rowKey
     */
    loadTreeRemove(id, key) {
      let _children = this.$refs["tableRef"].store.states.lazyTreeNodeMap[id];
      let _new_children = _children.filter(i => i[this.rowKey] != key);
      this.$set(
        this.$refs["tableRef"].store.states.lazyTreeNodeMap,
        id,
        _new_children
      );
    },
    // 导入vuex action函数
    ...mapActions("app", ["setPageSize"])
  }
};
</script>
<style lang="scss">
.ft-table .el-table {
  font-size: 14px;
}
.ft-thead > th {
  background: #f5f7fa;
  color: #333;
  text-align: center;
  // font-weight: 600;
}
.pagination-container {
  margin-top: 8px;
}
</style>