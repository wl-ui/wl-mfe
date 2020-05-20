<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action"></slot>
            <el-button
              type="text"
              size="medium"
              icon="el-icon-upload2"
              :disabled="false"
              @click="uploadFile"
            >
              导入
            </el-button>
            <form
              style="display:none"
              action=""
              method="post"
              enctype="multipart/form-data"
            >
              <input
                type="file"
                id="xmlFile"
                name="file"
                value=""
                @change="handleImportXmlAction"
              />
            </form>
            <el-button
              type="text"
              size="medium"
              icon="el-icon-download"
              @click="handleExportXmlAction"
            >
              导出XML
            </el-button>
            <el-button
              type="text"
              size="medium"
              icon="el-icon-download"
              @click="handleExportSvgAction"
            >
              导出SVG
            </el-button>
            <el-button
              type="text"
              size="medium"
              icon="el-icon-tickets"
              @click="xmlVisible = !xmlVisible"
            >
              预览
            </el-button>
            <el-button
              type="text"
              size="medium"
              icon="el-icon-delete"
              @click="handleClear"
            >
              清除
            </el-button>
            <el-button type="text" size="medium" icon="el-icon-document">
              保存
            </el-button>
          </el-header>
          <el-main>
            <div class="containers" :style="{ height: getContainerHeight }">
              <div class="canvas" ref="canvas" />
              <el-dialog
                :visible.sync="xmlVisible"
                title="XML"
                :fullscreen="false"
                top="10vh"
              >
                <vue-ace-editor
                  v-model="process.xml"
                  @init="editorInit"
                  lang="xml"
                  theme="chrome"
                  width="100%"
                  height="400"
                  :options="{ wrap: true, readOnly: true }"
                ></vue-ace-editor>
                <span slot="footer" class="dialog-footer">
                  <el-button
                    icon="el-icon-document"
                    v-clipboard:copy="process.xml"
                    v-clipboard:success="onCopy"
                  >
                    复 制
                  </el-button>
                  <el-button
                    icon="el-icon-close"
                    type="primary"
                    @click="xmlVisible = false"
                  >
                    关闭
                  </el-button>
                </span>
              </el-dialog>
              <div style="position:absolute;right:0;top:0" ref="panel" />
            </div>
          </el-main>
        </el-container>

        <el-aside class="widget-config-container">
          <el-container>
            <custom-properties-panel v-if="bpmnModeler" :modeler="bpmnModeler"></custom-properties-panel>
            <el-header height="45px">
              <div
                class="config-tab"
                :class="{ active: configTab == 'node' }"
                @click="handleConfigSelect('node')"
              >
                节点属性
              </div>
              <div
                class="config-tab"
                :class="{ active: configTab == 'process' }"
                @click="handleConfigSelect('process')"
              >
                流程属性
              </div>
            </el-header>
            <el-main class="config-content">
              <node-property-panel
                v-if="bpmnModeler && configTab == 'node'"
                :modeler="bpmnModeler"
              />
              <process-property-panel
                v-if="configTab == 'process'"
                v-bind.sync="process"
              />
            </el-main>
          </el-container>
        </el-aside>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
// bpmn-js 设计器
import BpmnModeler from "bpmn-js/lib/Modeler";
// 对flowable的扩展
import flowableExtensionModule from "jp-flowable-bpmn-moddle/lib";
import flowableModdle from "jp-flowable-bpmn-moddle/resources/flowable";

import NodePropertyPanel from "./components/NodePropertyPanel"; // 属性面板
import ProcessPropertyPanel from "./components/ProcessPropertyPanel";
import Translate from "./translate/Translate";
import BpmData from "./BpmData";
import VueAceEditor from "vue2-ace-editor";
import xml2js from "xml2js";
import xmlStr from "./mock/xmlStr";

// 引入组件
import CustomPropertiesPanel from "./components/customPropertiesPanel";

export default {
  name: "FtBpmn",
  props: {
    processName: {
      type: String,
      default: function() {
        return "流程" + new Date().getTime();
      }
    },
    processKey: {
      type: String,
      default: function() {
        return "process" + new Date().getTime();
      }
    },
    processDescription: {
      type: String,
      default: "描述"
    }
  },

  components: {
    NodePropertyPanel,
    ProcessPropertyPanel,
    CustomPropertiesPanel,
    VueAceEditor
  },

  data() {
    return {
      bpmnModeler: null,
      process: {
        name: this.processName,
        id: this.processKey,
        description: this.processDescription,
        xml: "",
        svg: ""
      },
      configTab: "node",
      nodeProcessSelect: null,

      xmlVisible: false,
      element: null,
      bpmData: new BpmData()
    };
  },

  methods: {
    /**
     * bind SVG element height.
     */
    getContainerHeight() {
      return document.body.offsetHeight - 75 + "px";
    },
    /**
     * init ace editor.
     */
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/xml"); //language
      require("brace/theme/chrome");
    },
    /**
     * init
     */
    createNewDiagram() {
      // 初始化XML文本
      this.process.xml = xmlStr(this.processKey, this.processName, this.processDescription)
      // 将字符串转换成图显示出来
      // let _this = this;
      this.bpmnModeler.importXML(this.process.xml, err => {
        if (err) {
          console.error(err);
        } else {
          this.adjustPalette();
          this.success();
        }
      });
    },

    editDiagram(xml) {
      this.process.xml = xml;
      this.bpmnModeler.importXML(this.process.xml, err => {
        if (err) {
          console.log(err);
        }
      });
    },
    success() {
      this.addModelerListener();
    },
    addModelerListener() { // 添加监听事件
      const eventBus = this.bpmnModeler.get("eventBus");
      const eventTypes = ["element.click", "shape.added"];
      let _this = this;
      eventTypes.forEach(function(eventType) {
        eventBus.on(eventType, function(e) {
          if (!e || !e.element) {
            return;
          }
          if (eventType === "element.click") {
            _this.element = e.element;
          }
          if (e.element.type === "bpmn:EndEvent") {
            _this.$nextTick(() => {
              const modeling = _this.bpmnModeler.get("modeling");
              const properties = {
                class: "com.future.material.flowable.listener.EndEventDelegate"
              }
              modeling.updateProperties(e.element, properties);
            })

          }
        });
      });
    },

    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas;
        const djsPalette = canvas.children[0].children[1].children[4];
        const djsPalStyle = {
          width: "130px",
          padding: "5px",
          background: "white",
          left: "20px",
          borderRadius: 0
        };
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key];
        }
        const palette = djsPalette.children[0];
        const allGroups = palette.children;
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey];
          for (var cKey in group.children) {
            const control = group.children[cKey];
            const controlStyle = {
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              padding: "5px"
            };
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf("entry") !== -1
            ) {
              const controlProps = this.bpmData.getControl(
                control.dataset.action
              );
              control.innerHTML = `<div style="font-size: 14px;font-weight:500;margin-left:15px;">${controlProps["title"]}</div>`;
              if (controlProps["tooltip"]) {
                control.title = controlProps["tooltip"];
              }
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey];
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded(type, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data);
      if (data) {
        if (type === "XML") {
          // 获取到图的xml，保存就是把这个xml提交给后台
          this.process.xml = data;
          return {
            filename: this.process.name + ".xml",
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data
          };
        }
        if (type === "SVG") {
          this.process.svg = data;
          return {
            filename: this.process.name + ".svg",
            href: "data:application/text/xml;charset=UTF-8," + encodedData,
            data: data
          };
        }
      }
    },
    /**
     * 导出BPMN XML文件
     */
    handleExportXmlAction() {
      const _this = this;
      this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        if (err) {
          console.error(err);
        }
        let { filename, href } = _this.setEncoded("XML", xml);
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      });
    },
    /**
     * 导出BPMN SVG文件
     */
    handleExportSvgAction() {
      const _this = this;
      this.bpmnModeler.saveSVG(function(err, svg) {
        if (err) {
          console.error(err);
        }
        let { filename, href } = _this.setEncoded("SVG", svg);
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename;
          a.href = href;
          a.click();
          URL.revokeObjectURL(a.href);
        }
      });
    },
    /**
     * 清空设计器内容
     */
    handleClear() {
      this.createNewDiagram();
    },
    /**
     * 复制内容到剪切板成功回调
     */
    onCopy() {
      this.$message.success("内容复制成功");
    },
    /**
     * 配置Tab切换
     */
    handleConfigSelect(value) {
      this.configTab = value;
    },
    uploadFile() {
      document.getElementById("xmlFile").click();
    },
    // 导入Xml文件
    handleImportXmlAction() {
      var resultFile = document.getElementById("xmlFile").files[0];
      var reader = new FileReader();
      reader.readAsText(resultFile);
      let that = this;
      reader.onload = function(oFREvent) {
        var xmlDoc = oFREvent.target.result;
        xml2js.parseString(xmlDoc, function(err, result) {
          if (result.definitions) {
            if (result.definitions.process[0].$) {
              that.process.name = result.definitions.process[0].$.name;
              that.process.id = result.definitions.process[0].$.id;
              that.process.description =
                result.definitions.process[0].$.description;
            }
          } else if (result["bpmn:definitions"]) {
            if (result["bpmn:definitions"]["bpmn:process"][0].$) {
              that.process.name =
                result["bpmn:definitions"]["bpmn:process"][0].$.name;
              that.process.id =
                result["bpmn:definitions"]["bpmn:process"][0].$.id;
              that.process.description =
                result["bpmn:definitions"]["bpmn:process"][0]["bpmn:documentation"][0];
            }
          } else {
            if (result["bpmn2:definitions"]["bpmn2:process"][0].$) {
              that.process.name =
                result["bpmn2:definitions"]["bpmn2:process"][0].$.name;
              that.process.id =
                result["bpmn2:definitions"]["bpmn2:process"][0].$.id;
              that.process.description =
                result["bpmn2:definitions"]["bpmn2:process"][0]["bpmn2:documentation"][0];
            }
          }
        });
        that.editDiagram(xmlDoc);
      };
    },
    updateProcessProperties(element, properties) {
      const elementRegistry = this.bpmnModeler.get("elementRegistry");
      var shape = elementRegistry.get(element.id);
      if (shape && shape.type === "bpmn:Process") {
        const modeling = this.bpmnModeler.get("modeling");
        modeling.updateProperties(element, properties);
      }
    }
  },

  mounted() {
    const canvas = this.$refs.canvas;
    const customTranslateModule = {
      translate: ["value", Translate]
    };
    // 生成实例
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      additionalModules: [
        flowableExtensionModule,
        customTranslateModule // 翻译
      ],
      moddleExtensions: {
        flowable: flowableModdle
      }
    });

    // 监听流程图改变事件
    const _this = this;
    this.bpmnModeler.on("commandStack.changed", () => {
      _this.bpmnModeler.saveSVG({ format: true }, function(err, svg) {
        _this.setEncoded("SVG", err ? null : svg);
      });
      _this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
        _this.setEncoded("XML", err ? null : xml);
      });
    });
    // 新增流程定义
    this.createNewDiagram();
  },
  watch: {
    "process.xml": {
      handler() {
        this.$nextTick(() => {});
      }
    },
    "process.name": {
      handler(val) {
        this.updateProcessProperties(this.element, { name: val });
      }
    },
    "process.id": {
      handler(val) {
        this.updateProcessProperties(this.element, { id: val });
      }
    },
    "process.description": {
      handler(val) {
        const elementRegistry = this.bpmnModeler.get("elementRegistry");
        var shape = elementRegistry.get(this.element.id);
        if (shape && shape.type === "bpmn:Process") {
          this.element.businessObject.documentation[0].text = val;
          const modeling = this.bpmnModeler.get("modeling");
          modeling.updateProperties(this.element, {});
        }
      }
    }
  }
};
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import "./assets/css/bpmn.scss";
@import "./assets/css/bpmn2.css";
@import "./assets/css/bpmn3.css";
.containers {
  background-color: #ffffff;
  width: 100%;
  height: 100%;

  .canvas {
    width: 100%;
    height: 100%;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .bjs-powered-by {
    display: none;
  }
  .toolbar {
    position: absolute;
    top: 0;
    right: 320px;
    height: 40px;
    width: 600px;
    border: 1px solid red;
    a {
      text-decoration: none;
      margin: 5px;
      color: #409eff;
    }
  }
}
</style>
