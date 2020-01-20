import { Form, Row, Col, Radio, Button, InputNumber, Collapse, Card, Statistic, Progress, Icon, Select, Table } from 'antd';
import React from 'react';
import numeral from 'numeral';
import { FORM_ITEM_LAYOUT } from '../../../layout';
import styles from './style.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const CreateForm = props => {
  const { form } = props;
  const { handleOrder, handleWatchOn, handRestart, positionData, getDefaultVlaue,
    advisePrice, currentInterest, handNum, isOver, profit, profitClose, count, direction,
    openOrClose, minPriceChange, openCollapse, strategyIsOpen, setStrategyTrue,
    setStrategyFasle, openSetStopLoss, availableFund, bond, fundId } = props;

  const okHandle = () => {
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      handleOrder(fieldsValue);
      form.resetFields();
    });
  };

  const watchOn = () => {
    handleWatchOn();
    form.resetFields();
  };

  const restartTest = () => {
    handRestart();
    form.resetFields();
  };

  const clickRow = record => {
    getDefaultVlaue(record);
    form.resetFields();
  };

  const callback = key => {
    openCollapse(key);
  };

  const openStrategy = () => {
    setStrategyTrue();
  };

  const closeStrategy = () => {
    setStrategyFasle();
  };

  const setStopLoss = () => {
    openSetStopLoss();
  }

  const { Panel } = Collapse;

  const columns = [
    {
      title: '序号',
      dataIndex: 'keyId',
      align: 'center',
      className: styles.columnName,
    },
    {
      title: '合约代码',
      dataIndex: 'INSTRUMENTID',
      align: 'center',
      className: styles.columnName,
    },
    {
      title: '数量',
      dataIndex: 'NUM',
      align: 'center',
      className: styles.columnName,
    },
    {
      title: '方向',
      dataIndex: 'DIRECTION',
      align: 'center',
      className: styles.columnName,
      render:
        (t, r) => {
          if (r.DIRECTION === '1') {
            return (
              <span style={{ color: 'red' }}>多头</span>
            );
          } if (r.DIRECTION === '2') {
            return (
              <span style={{ color: 'green' }}>空头</span>
            );
          }
        },
    },
    {
      title: '开仓成本',
      dataIndex: 'OPENCOST',
      align: 'center',
      className: styles.columnName,
      render:
        (t, r) => (
          <span>{numeral(r.OPENCOST).format('0,0.0')}</span>
        ),
    },
    {
      title: '持仓盈亏',
      dataIndex: 'PROFITINPOSIOTION',
      align: 'center',
      className: styles.columnName,
      render:
        (t, r) => {
          if (r.PROFITINPOSIOTION >= 0) {
            return (
              <span style={{ color: 'red' }}>{numeral(r.PROFITINPOSIOTION).format('0,0.00')}</span>
            );
          } if (r.PROFITINPOSIOTION < 0) {
            return (
              <span style={{ color: 'green' }}>{numeral(r.PROFITINPOSIOTION).format('0,0.00')}</span>
            );
          }
        },
    },
    {
      title: '保证金',
      dataIndex: 'BOND',
      align: 'center',
      className: styles.columnName,
      render:
        (t, r) => (
          <span>{numeral(r.BOND).format('0,0.00')}</span>
        ),
    }];

  return (
    <Collapse style={{ margin: '1%' }} onChange={callback} >
      <Panel header="打开交易面板" style={{ fontSize: '13px' }}>
        <Progress percent={count * 10} status="active" />
        <div style={{ float: 'left', width: '100%', height: '300px' }}>
          <div style={{ width: '42%', float: 'left', marginRight: '1.5%', backgroundColor: '#fafafa', border: '1px solid #efefef' }}>
            <Form>
              <Row gutter={8}>
                <Col span={24}>
                  <FormItem
                    {...FORM_ITEM_LAYOUT.formItemLayout2}
                    label="买 卖 "
                  >
                    {form.getFieldDecorator('direction', {
                      rules: [{ required: true, message: '请选择买卖方向' }],
                      initialValue: direction,
                    })(
                      <RadioGroup>
                        <Radio value="1">买入</Radio>
                        <Radio value="2">卖出</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}>
                  <FormItem
                    {...FORM_ITEM_LAYOUT.formItemLayout2}
                    label="开 平 "
                  >
                    {form.getFieldDecorator('openOrClose', {
                      rules: [{ required: true, message: '请选择开平仓方向' }],
                      initialValue: openOrClose,
                    })(
                      <RadioGroup>
                        <Radio value="1">开仓</Radio>
                        <Radio value="2">平仓</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <FormItem
                    {...FORM_ITEM_LAYOUT.formItemLayout33}
                    label="手 数 "
                  >
                    {form.getFieldDecorator('num', {
                      rules: [{ required: true, message: '请输入买卖手数' }],
                      initialValue: handNum,
                    })(
                      <InputNumber min={1} max={1000} style={{ width: '80%' }}
                        step={1}
                        precision={0}
                      />,
                    )}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem
                    {...FORM_ITEM_LAYOUT.formItemLayout33}
                    label="价 格 "
                  >
                    {form.getFieldDecorator('price', {
                      rules: [{ required: true, message: '请输入买卖价格' }],
                      initialValue: advisePrice,
                    })(
                      <InputNumber
                        min={0}
                        max={100000}
                        step={minPriceChange}
                        precision={1}
                        style={{ width: '80%' }}
                      />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <div style={{ marginLeft: '12%', marginBottom: '2%', marginTop: 8 }}>
                <Button type="primary" style={{ width: '25%' }} onClick={() => okHandle()} disabled={isOver === true} >下单</Button>
                <Button type="primary" style={{ width: '25%', marginLeft: '10%' }} onClick={() => watchOn()} disabled={isOver === true} >观望</Button>
                {
                  isOver === false &&
                  (
                    <Button type="danger" style={{ width: '25%', marginLeft: '10%' }} onClick={() => restartTest()}>重新开始</Button>
                  )
                }
                {
                  isOver === true &&
                  (
                    <Button type="danger" style={{ width: '25%', marginLeft: '10%' }} onClick={() => restartTest()}>再来一次</Button>
                  )
                }
                <Select defaultValue="双均线策略" style={{ width: '25%', fontSize: '12px', float: 'left', marginTop: '5%' }}>
                  <Option value="1">双均线策略</Option>
                </Select>

                {
                  strategyIsOpen === false &&
                  (
                    <div>
                      <Button type="primary" size="small" onClick={() => openStrategy()}
                        style={{ width: '15%', marginLeft: '10%', float: 'left', marginTop: '6%', backgroundColor: '#14b143', borderColor: '#14b143', fontSize: '13px' }} >启动</Button>
                      <p style={{ float: 'left', marginTop: '7%', marginLeft: '2%', fontSize: '12px' }}>
                        <Icon type="check-circle" theme="twoTone" twoToneColor="gray" />
                        未运行
                    </p>
                    </div>
                  )
                }
                {
                  strategyIsOpen === true &&
                  (
                    <div>
                      <Button type="danger" size="small" onClick={() => closeStrategy()}
                        style={{ width: '15%', marginLeft: '10%', float: 'left', marginTop: '6%', fontSize: '13px' }} >断开</Button>
                      <p style={{ float: 'left', marginTop: '7%', marginLeft: '2%', fontSize: '12px', color: '#52c41a' }}>
                        <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                        已运行
                    </p>
                    </div>
                  )
                }
                <Button type="primary" size="small" onClick={() => setStopLoss()}
                  style={{ width: '20%', marginLeft: '10%', float: 'left', marginTop: '6%', fontSize: '13px' }} >止损止盈</Button>
              </div>
            </Form>
          </div>
          <div style={{ width: '52%', float: 'left', height: '100%' }}>
            <div style={{ height: '50%' }}>
              <Card style={{ background: '#fafafa' }}>
                <Row gutter={12} style={{ marginBottom: 10, marginTop: -5 }}>
                  <div>
                    <Col span={8} style={{ borderRight: '1px solid #1890ff', textAlign: 'center' }}>
                      <Statistic
                        title="资产账号"
                        value={fundId}
                        valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                      />
                    </Col>
                  </div>
                  <Col span={8} style={{ borderRight: '1px solid #1890ff', textAlign: 'center' }}>
                    <Statistic
                      title="当前权益"
                      value={currentInterest}
                      precision={2}
                      valueStyle={{ color: '#cf1322', fontSize: '16px' }} // 不变
                      suffix=" 元"
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <Statistic
                      title="可用资金"
                      value={availableFund}
                      precision={2}
                      valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                      suffix=" 元"
                    />
                  </Col>
                </Row>
                <Row gutter={12}>
                  <Col span={8} style={{ borderRight: '1px solid #1890ff', textAlign: 'center' }}>
                    <Statistic
                      title="保证金"
                      value={bond}
                      precision={2}
                      valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                      suffix=" 元"
                    />
                  </Col>
                  {
                    profit >= 0 &&
                    (
                      <Col span={8} style={{ borderRight: '1px solid #1890ff', textAlign: 'center' }}>
                        <Statistic
                          title="浮动盈亏"
                          value={profit}
                          precision={2}
                          valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                          prefix={<Icon type="arrow-up" />}
                          suffix=" 元"
                        />
                      </Col>
                    )
                  }
                  {
                    profit < 0 &&
                    (
                      <Col span={8} style={{ borderRight: '1px solid #1890ff', textAlign: 'center' }}>
                        <Statistic
                          title="浮动盈亏"
                          value={profit}
                          precision={2}
                          valueStyle={{ color: '#3f8600', fontSize: '16px' }}
                          prefix={<Icon type="arrow-down" />}
                          suffix=" 元"
                        />
                      </Col>
                    )
                  }
                  {
                    profitClose >= 0 &&
                    (
                      <Col span={8} style={{ textAlign: 'center' }}>
                        <Statistic
                          title="平仓盈亏"
                          value={profitClose}
                          precision={2}
                          valueStyle={{ color: '#cf1322', fontSize: '16px' }}
                          prefix={<Icon type="arrow-up" />}
                          suffix=" 元"
                        />
                      </Col>
                    )
                  }
                  {
                    profitClose < 0 &&
                    (
                      <Col span={8} style={{ textAlign: 'center' }}>
                        <Statistic
                          title="平仓盈亏"
                          value={profitClose}
                          precision={2}
                          valueStyle={{ color: '#3f8600', fontSize: '16px' }}
                          prefix={<Icon type="arrow-down" />}
                          suffix=" 元"
                        />
                      </Col>
                    )
                  }
                </Row>
              </Card>
            </div>
            <div style={{ marginTop: 5 }}>
              <Table
                size="small"
                columns={columns}
                rowKey={record => record.keyId}
                pagination={false}
                dataSource={positionData}
                onRow={record => ({
                  onClick: event => {
                    clickRow(record);
                  },
                })}
              />
            </div>
          </div>
        </div>
      </Panel>
    </Collapse>
  );
};

export default Form.create()(CreateForm);
