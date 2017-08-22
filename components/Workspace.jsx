import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'node-blockly/browser';
import { autobind } from 'core-decorators';
import DockerCompose from '../workspaces/docker-compose';

export default class extends PureComponent {

  static displayName = 'WorkSpace';

  state = {
    blocklyAreaHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }

  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: undefined
  }

  componentDidMount() {
    const workspace = Blockly.inject(this.blocklyDiv, DockerCompose);
    this.workspace = workspace;
    workspace.addChangeListener(this.onWorkspaceChange);

    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

    Blockly.svgResize(workspace);

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  @autobind
  onWorkspaceChange() {
    const { onChange } = this.props;

    if (onChange) {
      /*
      const xmlDom = Blockly.Xml.workspaceToDom(this.workspace);
      const xmlText = Blockly.Xml.domToPrettyText(xmlDom);
       */
      const cmds = Blockly.DockerCompose.workspaceToCode(this.workspace);
      onChange(cmds);
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

    this.setState((prevState, props) => ({
      blocklyAreaHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    }));
  }

  render() {
    const { blocklyAreaHeight }  = this.state;
    return (
      <div ref={(el) => { this.blocklyArea = el; }} style={{ height: blocklyAreaHeight }} >
        <div ref={(el) => { this.blocklyDiv = el; }} style={{ position: 'absolute' }} />
      </div>
    );
  }
}