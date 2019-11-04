import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import numeral from 'numeral';
import { connect } from 'dva';
import SummaryCard from '../../components/SummaryCard/SummaryCard';

@connect(({ user, home }) => ({
  currentUser: user.currentUser,
  home,
}))

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { currentUser = {} } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getUserInfo',
      payload: {
        userId: currentUser.userId,
      },
    });
  }

  render() {
    const yuan = val => `￥ ${numeral(val).format('0,0.00')}`;

    const {
      home: { InitialInterest, bond, profitInPosition,
        profitInClosePosition, currentInterest, availableFund },
  } = this.props;

    return (
      <div>
        <Card title="平台管理">
          <Card type="inner" title="资金信息" >
            <Row gutter={16} style={{ marginTop: 10 }}>
              <Col span={8}>
                <SummaryCard
                  meta="期初权益"
                  summary={`${yuan(InitialInterest)}`}
                />
              </Col>
              <Col span={8}>
                <SummaryCard
                  meta="当前权益"
                  summary={`${yuan(currentInterest)}`}
                />
              </Col>
              <Col span={8}>
                <SummaryCard
                  meta="保证金"
                  summary={`${yuan(bond)}`}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={8}>
                <SummaryCard
                  meta="可用资金 "
                  summary={`${yuan(availableFund)}`}
                />
              </Col>
              <Col span={8}>
                <SummaryCard
                  meta="持仓盈亏"
                  summary={`${yuan(profitInPosition)}`}
                />
              </Col>
              <Col span={8}>
                <SummaryCard
                  meta="平仓盈亏"
                  summary={`${yuan(profitInClosePosition)}`}
                />
              </Col>
            </Row>
          </Card>
        </Card>
      </div>
    );
  }
}
