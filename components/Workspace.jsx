import React, { PureComponent } from 'react';
import Blockly from 'node-blockly/browser';
import { autobind } from 'core-decorators';
import DockerCompose from '../workspaces/docker-compose';

export default class extends PureComponent {

  static displayName = 'WorkSpace';

  componentDidMount() {
    const workspace = Blockly.inject(this.blocklyDiv, DockerCompose);
    // self.workspace.addChangeListener(self.onWorkspaceChange);
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this), false);

    Blockly.svgResize(workspace);

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
  componentDidMount() {
    this.workspace = injectWorkSpace(this.blocks);
    const self = this;
    setTimeout(() => {
      self.onResize();
      Blockly.svgResize(self.workspace);
      self.workspace.addChangeListener(self.onWorkspaceChange);
    }, 200);
  }
*/

  @autobind
  onWorkspaceChange() {
    const { changeCode } = this.props;

    if (changeCode) {
      const xmlDom = Blockly.Xml.workspaceToDom(this.workspace);
      const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
      const JavaScript = Blockly.JavaScript.workspaceToCode(this.workspace);
      const jsonCommands = Blockly.JSON.workspaceToCode(this.workspace);
      changeCode({ json: jsonCommands, xml: xmlText, JavaScript });
    }
  }

  @autobind
  updateDimensions() {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = this.blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);

    // Position blocklyDiv over blocklyArea.
    this.blocklyDiv.style.left = x + 'px';
    this.blocklyDiv.style.top = y + 'px';
    this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + 'px';
    this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + 'px';
  }

  render() {
    const { highlightedBlockId, children } = this.props;

    if (this.workspace) {
      this.workspace.highlightBlock(highlightedBlockId);
    }

    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (
      <div ref={(el) => { this.blocklyArea = el; }} style={{ height: h }} >
        <div ref={(el) => { this.blocklyDiv = el; }} style={{ position: 'absolute' }} />
      </div>
    );
  }
}