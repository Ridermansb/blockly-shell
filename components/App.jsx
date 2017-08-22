import React, { Component } from 'react';
import Workspace from './Workspace'

import 'element-theme-default';
import 'assets/style.css';

export default class extends Component {
  static displayName = 'App';
  render() {
    return (
      <Workspace />
    );
  }
}
