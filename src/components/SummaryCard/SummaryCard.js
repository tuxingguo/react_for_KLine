import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';

import styles from './index.less';


export default class SummaryCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    const renderSummary = summary => {
      if (this.props.onClick) {
        return (
          <a onClick={() => this.props.onClick()}>
            {summary}
          </a>
        );
      }
      return summary;
    };

    return (
      <Card bodyStyle={{ padding: '10px' }}>
        <div className={styles.meta}>{this.props.meta}</div>
        <div className={styles.summary}>{renderSummary(this.props.summary)}</div>
      </Card>
    );
  }
}

SummaryCard.propTypes = {
  meta: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
};
