import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import router from 'umi/router';

export default class PageCard extends PureComponent {
  goBack() {
    if (this.props.goBack) {
      router.goBack();
    }
  }

  render() {
    const navBack = () => {
      if (this.props.needBack) {
        return (
          <a style={{ fontSize: 14, marginRight: 5 }}>
            <Icon type="left" />
            <span>返回</span>
          </a>
        );
      }
    };
    const title = () => (
        <div>
          {navBack()}
          <span>{this.props.title}</span>
        </div>
      );

    return (
      <Card title={title()} bordered={false} extra={this.props.extra}>
        {this.props.children}
      </Card>
    );
  }
}
