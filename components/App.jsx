import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import Workspace from './Workspace'
import CommandPreview from './CommandPreview'

import 'element-theme-default';
import 'assets/style.css';

export default class extends Component {
  static displayName = 'App';

  state = {
    commands: ''
  }

  @autobind
  onWorkspaceChange(commands) {
    this.setState((prevState, props) => ({commands}));
  }

  render() {
    const { commands } = this.state;

    return (
      <div>
        <Workspace onChange={this.onWorkspaceChange} />
        <CommandPreview commands={commands} />
      </div>
    );
  }
}
