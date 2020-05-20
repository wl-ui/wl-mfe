<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="Id">
        <el-input type="text" v-model="id" @input="changeId"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input type="text" v-model="name" @input="changeName"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="documentation" @input="changeDocumentation"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil"
export default {
  name: 'CustomGeneral',
  props: {
    modeler: {
      type: Object,
      required: true
    },
    
  },
  data() {
    return {
      id: '',
      name: '',
      documentation: '',
      element: null,
      selectedElements: [],
    }
  },
  mounted () {
    this.handleModeler();
  },
  methods: {
    handleModeler() {
      let _this = this;
      this.modeler.on("selection.changed", e => {
        _this.selectedElements = e.newSelection;
        _this.element = e.newSelection[0];
        if (_this.element) {
          _this.setDefaultProperties()
        }
        
      });
      this.modeler.on("element.changed", e => {
        const { element } = e;
        const { element: currentElement } = _this;
        if (!currentElement) {
          return;
        }
        if (element.id === currentElement.id) {
          _this.element = element;
        }
      });
      this.modeler.on("element.click", e => {
        if (e.element.type === "bpmn:Process") {
          _this.element = e.element;
          _this.setDefaultProperties();
        }
        
      })
    },
    setDefaultProperties() {
      const { element } = this;
      if (element) {
        const { type, businessObject } = element;
        const { name, id } = businessObject;
        if (this.verifyIsEvent(type)) {
          this.eventType = businessObject.eventDefinitions ? businessObject.eventDefinitions[0]['$type'] : ''
          // console.log(this.eventType)
        } else if (this.verifyIsTask(type)) {
          this.taskType = type;
        }
        this.name = name;
        this.id = id;
        var documentations = businessObject && businessObject.get('documentation'),
        text = (documentations && documentations.length > 0) ? documentations[0].text : '';
        this.documentation = text;
      }
    },
    verifyIsEvent(type) {
      return type.includes('Event')
    },
    verifyIsTask(type) {
      return type.includes('Task')
    },
    changeId(val) {
      this.updateProperties({id: val});
    },
    changeName(val) {
      this.updateProperties({name: val});
    },
    changeDocumentation(val) {
      this.element.businessObject.documentation[0].text = val;
      const modeling = this.bpmnModeler.get("modeling");
      modeling.updateProperties(this.element, {});
    },
    updateProperties(properties) {
      const { modeler, element } = this;
      const modeling = modeler.get('modeling');
      modeling.updateProperties(element, properties)
    }
  }
}
</script>

<style>

</style>