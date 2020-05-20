<template>
  <div class="property-panel" ref="propertyPanel">
    <el-form
      :inline="false"
      :model="form"
      label-width="100px"
      size="small"
      label-position="left"
    >
      <el-form-item label="节点类型">
        <el-input v-model="form.$type" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点ID">
        <el-input v-model="form.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="节点名称">
        <el-input v-model="form.name" @input="nameChange"></el-input>
      </el-form-item>
      <el-form-item label="节点颜色">
        <el-color-picker
          v-model="form.color"
          @active-change="colorChange"
        ></el-color-picker>
      </el-form-item>
      <!-- 用户任务 -->
      <template v-if="element && userTask">
        <!-- 指定节点表单 -->
        <el-form-item label="表单类型">
          <el-input v-model="form.formCategory"></el-input>
        </el-form-item>
        <el-form-item label="表单KEY">
          <el-input v-model="form.formKey"></el-input>
        </el-form-item>
        <!-- 任务节点允许选择人员 -->
        <el-form-item label="节点人员">
          <el-select
            v-model="form.userType"
            placeholder="请选择"
            @change="value => typeChangeClear(value, userTypes)"
          >
            <el-option
              v-for="item in userTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 指定人员 -->
        <el-form-item
          label="指定人员"
          v-if="userTask && form.userType === 'assignee'"
        >
          <el-select
            v-model="form.assignee"
            placeholder="请选择"
            key="1"
            @change="value => addTypeAndInfo({'flowable:assignee': '${' + form.userType + '.' + value + '}'})"
          >
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 候选人员 -->
        <el-form-item
          label="候选人员"
          v-else-if="userTask && form.userType === 'candidateUsers'"
        >
          <el-select
            v-model="form.candidateUsers"
            placeholder="请选择"
            key="2"
            multiple
            @change="
              value => addTypeAndInfo({'flowable:assignee': '${' + form.userType + '.' + value.join(',') || value + '}'})
            "
          >
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 角色/岗位 -->
        <el-form-item
          label="角色/岗位"
          v-else-if="userTask && form.userType === 'candidateGroups'"
        >
          <el-select
            v-model="form.candidateGroups"
            placeholder="请选择"
            @change="value => addTypeAndInfo({'flowable:assignee': '${' + form.userType + '.' + value + '}'})"
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <!-- 服务任务 -->
      <template v-if="element && ServiceTask">
        <el-form-item label="实现方式">
          <el-select
            v-model="form.serviceType"
            placeholder="请选择"
            @change="value => typeChangeClear(value, serviceTypes)"
          >
            <el-option
              v-for="item of serviceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="Java类"
          v-if="element && ServiceTask && form.serviceType === 'Java Class'"
        >
          <el-select
            v-model="form.javaClass"
            placeholder="请选择"
            @change="value => addTypeAndInfo({'flowable:assignee': '${' + form.serviceType + '.' + value + '}'})"
          >
            <el-option
              v-for="item of JavaClasses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
      <!-- 分支允许添加条件 -->
      <el-form-item label="分支条件" v-if="sequenceFlow">
        <el-select v-model="form.branchCondition" placeholder="请选择" @change="value => typeChangeClear(value, branchConditions)">
          <el-option
            v-for="item in branchConditions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "NodePropertyPanel",
  props: {
    /**
     * BpmnModeler设计器对象
     */
    modeler: {
      type: Object,
      required: true
    }
  },
  computed: {
    userTask() {
      if (!this.element) {
        return;
      }
      return this.element.type === "bpmn:UserTask";
    },
    sequenceFlow() {
      if (!this.element) {
        return;
      }
      return this.element.type === "bpmn:SequenceFlow";
    },
    ServiceTask() {
      if (!this.element) {
        return;
      }
      return this.element.type === "bpmn:ServiceTask";
    }
  },
  data() {
    return {
      form: {
        id: "",
        name: "",
        color: null,
        service: "",
        javaClass: ""
      },
      element: {},
      userTypes: [
        {
          label: "指定人员",
          value: "assignee"
        },
        {
          label: "候选人员",
          value: "candidateUsers"
        },
        {
          label: "角色/岗位",
          value: "candidateGroups"
        }
      ],
      users: [
        {
          value: "zhangsan",
          label: "张三"
        },
        {
          value: "lisi",
          label: "李四"
        },
        {
          value: "wangwu",
          label: "王五"
        }
      ],
      roles: [
        {
          value: "manager",
          label: "经理"
        },
        {
          value: "personnel",
          label: "人事"
        },
        {
          value: "charge",
          label: "主管"
        }
      ],
      branchConditions: [
        {
          label: "大于等于",
          value: ">="
        },
        {
          label: "小于等于",
          value: "<="
        }
      ],
      // 实现方式
      serviceTypes: [
        {
          label: "Java类",
          value: "Java Class"
        }
      ],
      // Java类
      JavaClasses: [
        {
          label: "开启定时",
          value: "com.service.Start"
        }
      ]
    };
  },
  mounted() {
    this.handleModeler();
  },
  methods: {
    handleModeler() {
      // 监听节点选择变化
      let _this = this;
      this.modeler.on("selection.changed", e => {
        const element = e.newSelection[0];
        if (!element) {
          return;
        }
        _this.element = element;
        _this.form = {
          ...element.businessObject,
          ...element.businessObject.$attrs
        };
        if (_this.form.userType === "candidateUsers") {
          _this.form["candidateUsers"] =
            _this.form["candidateUsers"].split(",") || [];
        }
      });

      //  监听节点属性变化
      this.modeler.on("element.changed", e => {
        const { element } = e;
        if (!element) {
          return;
        }
        //  新增节点需要更新回属性面板
        if (element.id === this.form.id) {
          this.form.name = element.businessObject.name;
          this.form = { ...this.form };
        }
      });
    },

    // 属性面板名称，更新回流程节点
    nameChange(name) {
      const modeling = this.modeler.get("modeling");
      modeling.updateLabel(this.element, name);
    },

    // 属性面板颜色，更新回流程节点
    colorChange(color) {
      const modeling = this.modeler.get("modeling");
      modeling.setColor(this.element, {
        fill: null,
        stroke: color
      });
      modeling.updateProperties(this.element, { color: color });
    },

    // 任务节点配置
    addTypeAndInfo(properties) {
      this.updateProperties(properties);
    },

    // 切换类型时清除之前选中的类型
    typeChangeClear(value, types) {
      let _this = this;
      types.forEach(type => {
        if (type.value !== value) {
          delete _this.element.businessObject[type.value];
        }
        delete _this.element.businessObject.$attrs[type.value];
        delete _this.form[type.value];
      });
      console.log(_this.element.businessObject);
      this.updateProperties({'flowable:assignee': '${' + value + '}'})
    },

    // 在这里我们封装一个通用的更新节点属性的方法
    updateProperties(properties) {
      const modeling = this.modeler.get("modeling");
      modeling.updateProperties(this.element, properties);
    }
  },

  watch: {
    "form.name": {
      handler(val) {
        if (this.element) {
          this.element.businessObject.name = val;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.property-panel {
  padding: 10px;
  width: 100%;
}
</style>
