import { Button, Drawer, Row, Col, Form, Input, InputNumber, Alert, Icon } from 'antd';
import React from 'react';
import { FORM_ITEM_LAYOUT } from '../../../layout';

const FormItem = Form.Item;

const StopLossModal = props => {
  const { modalVisible, childmodalVisible1, childmodalVisible2, mainDrawerClose, form,
    openChildrenDrawer1, childrenDrawerClose1, openChildrenDrawer2, childrenDrawerClose2,
    transCode, transType, setStartLoss1, stopLoss, stopProfit, priceDifference,
    setStartLoss2, stopLossIsOpen1, stopLossIsOpen2, minPriceChange, closeStopLoss1,
    closeStopLoss2 } = props;

  const onClose = () => {
    mainDrawerClose();
  }

  const showChildrenDrawer1 = () => {
    openChildrenDrawer1();
  }

  const onChildrenDrawerClose1 = () => {
    childrenDrawerClose1();
  }

  const showChildrenDrawer2 = () => {
    openChildrenDrawer2();
  }

  const onChildrenDrawerClose2 = () => {
    childrenDrawerClose2();
  }

  const createMarkup1 = () => ({ __html: '1、请先认真阅读左方使用说明后再使用此功能；\n2、止损价差默认为10个最小变动价；\n3、止盈价差默认为20个最小变动价。' })

  const createMarkup2 = () => ({ __html: '1、请先认真阅读左方使用说明后再使用此功能；\n2、固定价差默认为10个最小变动价；\n3、买开仓后的最高价 - 买开仓价格 > 20个最小变动价，开始触发。\n4、卖开仓价格 - 卖开仓后的最低价 > 20个最小变动价，开始触发。' })

  const resetLoss1 = () => {
    closeStopLoss1();
  }

  const resetLoss2 = () => {
    closeStopLoss2();
  }

  const startLoss1 = () => {
    form.validateFields((err, fieldsValue) => {
      setStartLoss1(fieldsValue);
    });
  }

  const startLoss2 = () => {
    form.validateFields((err, fieldsValue) => {
      setStartLoss2(fieldsValue);
    });
  }

  return (
    <div>
      <Drawer
        title="止损/止盈设置"
        width={400}
        closable={false}
        onClose={onClose}
        visible={modalVisible}
      >

        <div>
          <Button type="primary" onClick={showChildrenDrawer1} style={{ marginTop: 20, width: '35%', float: 'left' }}>
            限价止损/止盈
          </Button>
          {
            stopLossIsOpen1 === true &&
            (
              <p style={{ fontSize: '12px', color: '#52c41a', float: 'left', marginTop: '9%', marginLeft: '2%' }}>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                已启动
              </p>
            )
          }
          {
            stopLossIsOpen1 === false &&
            (
              <p style={{ fontSize: '12px', float: 'left', marginTop: '9%', marginLeft: '2%' }}>
                <Icon type="check-circle" theme="twoTone" twoToneColor="gray" />
                已关闭
              </p>
            )
          }
        </div>
        <p style={{ clear: 'both' }}></p>
        <p>限价止盈/止损的逻辑：</p>
        <p>1、以开仓价格为基准价，当前亏损或盈利超过固定的价差时进行止损/止盈。</p>

        <div>
          <Button type="primary" onClick={showChildrenDrawer2} style={{ marginTop: 40, width: '35%', float: 'left' }}>
            跟踪止损
          </Button>
          {
            stopLossIsOpen2 === true &&
            (
              <p style={{ fontSize: '12px', color: '#52c41a', float: 'left', marginTop: '15%', marginLeft: '2%' }}>
                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
                已启动
              </p>
            )
          }
          {
            stopLossIsOpen2 === false &&
            (
              <p style={{ fontSize: '12px', float: 'left', marginTop: '15%', marginLeft: '2%' }}>
                <Icon type="check-circle" theme="twoTone" twoToneColor="gray" />
                已关闭
              </p>
            )
          }
        </div>
        <p style={{ clear: 'both' }}></p>
        <p>跟踪止损的逻辑：</p>
        <p>1、以开仓后的最高或者最低价为基准价，回撤超过价差后进行止损。</p>
        <p>2、这里的价差可以使用最大盈利的百分比，也可以是固定价差。通常还会限制当最大盈利超过某一范围后再启动止盈止损策略。</p>

        <Drawer
          title="限价止损/止盈"
          width={400}
          closable={false}
          onClose={onChildrenDrawerClose1}
          visible={childmodalVisible1}
        >
          <Alert
            style={{ marginBottom: '5%', whiteSpace: 'pre-wrap' }}
            message="注意："
            description={
              <div dangerouslySetInnerHTML={createMarkup1()} />
            }
            type="info"
          />
          <div>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="品种代码"
                >
                  {form.getFieldDecorator('transCode', {
                    rules: [{ required: false }],
                    initialValue: transCode,
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="品种名称"
                >
                  {form.getFieldDecorator('transType', {
                    rules: [{ required: false }],
                    initialValue: transType,
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="止损价差"
                >
                  {form.getFieldDecorator('stopLoss', {
                    rules: [{ required: true }],
                    initialValue: stopLoss,
                  })(
                    <InputNumber
                      min={0}
                      max={1000}
                      step={minPriceChange}
                      precision={2}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="止盈价差"
                >
                  {form.getFieldDecorator('stopProfit', {
                    rules: [{ required: true }],
                    initialValue: stopProfit,
                  })(
                    <InputNumber
                      min={0}
                      max={1000}
                      step={minPriceChange}
                      precision={2}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ float: 'left', width: '100%', marginTop: '5%' }}>
              <Button type="primary" style={{ width: '20%', marginLeft: '48%' }} onClick={() => startLoss1()}>启动</Button>
              <Button type="danger" style={{ width: '20%', marginLeft: '5%' }} onClick={() => resetLoss1()}>关闭</Button>
            </div>
          </div>
        </Drawer>

        <Drawer
          title="跟踪止损"
          width={400}
          closable={false}
          onClose={onChildrenDrawerClose2}
          visible={childmodalVisible2}
        >
          <Alert
            style={{ marginBottom: '5%', whiteSpace: 'pre-wrap' }}
            message="注意："
            description={
              <div dangerouslySetInnerHTML={createMarkup2()} />
            }
            type="info"
          />
          <div>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="品种代码"
                >
                  {form.getFieldDecorator('transCode', {
                    rules: [{ required: false }],
                    initialValue: transCode,
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="品种名称"
                >
                  {form.getFieldDecorator('transType', {
                    rules: [{ required: false }],
                    initialValue: transType,
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={18}>
                <FormItem
                  {...FORM_ITEM_LAYOUT.formItemLayout3}
                  label="初始价差"
                >
                  {form.getFieldDecorator('priceDifference', {
                    rules: [{ required: true }],
                    initialValue: priceDifference,
                  })(
                    <InputNumber
                      min={0}
                      max={1000}
                      step={minPriceChange}
                      precision={2}
                      style={{ width: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{ float: 'left', width: '100%', marginTop: '5%' }}>
              <Button type="primary" style={{ width: '20%', marginLeft: '48%' }} onClick={() => startLoss2()}>启动</Button>
              <Button type="danger" style={{ width: '20%', marginLeft: '5%' }} onClick={() => resetLoss2()}>关闭</Button>
            </div>
          </div>
        </Drawer>
      </Drawer>
    </div>
  );
};

export default Form.create()(StopLossModal);
