import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';
import { Card, Layout } from 'element-react';

import 'highlight.js/styles/github-gist.css';

const styles = {
  root: {
    position: 'absolute',
    bottom: 24,
    left: 120,
    width: '82%',
  }
}

export default class extends PureComponent {
  static displayName = 'CommandPreview';

  static propTypes = {
    commands: PropTypes.string,
  }

  static defaultProps = {
    commands: ''
  }

  componentDidMount() {
    hljs.configure({useBR: true});
    hljs.initHighlighting();
  }

  render() {
    const { commands }  = this.props;
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    styles.root.width = w - 210;

    return (<Layout.Row style={styles.root}>
      <Layout.Col span="24">
        <div className="grid-content bg-purple-dark">
          <Card className="box-card">
            <pre>
              <code className="shell">
                {hljs.highlight('shell', commands).value}
              </code>
            </pre>
          </Card>
        </div>
      </Layout.Col>
    </Layout.Row>)
  }
}
