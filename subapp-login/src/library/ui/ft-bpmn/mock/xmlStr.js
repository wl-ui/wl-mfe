export default function(processKey, processName, processDescription) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                    targetNamespace="http://bpmn.io/schema/bpmn"
                    xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
    <bpmn:process id="${processKey}" name="${processName}">
      <bpmn:documentation>${processDescription}</bpmn:documentation>
      <bpmn:startEvent id="StartEvent_01ydzqe" />
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">
        <bpmndi:BPMNShape id="StartEvent_01ydzqe_di" bpmnElement="StartEvent_01ydzqe">
          <dc:Bounds x="242" y="212" width="36" height="36" />
          <bpmndi:BPMNLabel>
            <dc:Bounds x="247" y="263" width="25" height="14" />
          </bpmndi:BPMNLabel>
        </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>`
}