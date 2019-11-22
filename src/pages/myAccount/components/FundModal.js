import { Modal, Form, InputNumber, Alert, Row, Col } from 'antd';
import React from 'react';

const FormItem = Form.Item;

const FundModal = props => {
  const { modalVisible, form, cancelFund, confirmFund } = props;
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      confirmFund(fieldsValue);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    cancelFund();
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="入金设置"
      visible={modalVisible}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
    >
      <div>
        <Alert message="单此入金最大金额为 1,000,000 元" type="info" showIcon
          style={{ marginBottom: '5%', width: '80%', fontSize: '13px', marginLeft: '4%' }} />

        <Row gutter={8}>
          <Col span={24}>
            <FormItem
              labelCol={{
                span: 5,
              }}
              wrapperCol={{
                span: 18,
              }}
              label="转入资金"
            >
              {form.getFieldDecorator('fund', {
                rules: [{ required: true, message: '请输入入金金额' }],
                initialValue: 0.00,
              })(
                <InputNumber
                  min={0}
                  max={1000000}
                  step={0.01}
                  precision={2}
                  style={{ width: '84%' }}
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  size="large"
                />,
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default Form.create()(FundModal);
