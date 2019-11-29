import { Modal, Form, Input, Popover, Progress, message } from 'antd';
import React from 'react';
import styles from './Register.less';

const FormItem = Form.Item;

const PassModal = props => {
  const { modalVisible, form, confirmPass, cancelPass,
    help, visible, checkPassword, confirmOldPassword } = props;
  const handleOk = () => {
    if (form.getFieldValue('password') !== form.getFieldValue('confirm')) {
      message.error('密码输入不一致');
      return;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      confirmPass(fieldsValue);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    cancelPass();
  };

  const checkPassword1 = (rule, value, callback) => {
    checkPassword(rule, value, callback, form);
  }

  const passwordStatusMap = {
    ok: <div className={styles.success}>强度：强</div>,
    pass: <div className={styles.warning}>强度：中</div>,
    poor: <div className={styles.error}>强度：太短</div>,
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  const checkConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  const checkOldPassword = (rule, value, callback) => {
    if (value !== '' && value !== undefined && value !== null) {
      confirmOldPassword(rule, value, callback);
    } else {
      callback();
    }
  };

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="修改密码"
      visible={modalVisible}
      onOk={() => handleOk()}
      onCancel={() => handleCancel()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 18,
        }}
        label="原密码"
      >
        {form.getFieldDecorator('oldPassword', {
          rules: [
            {
              required: true,
              message: '原密码必须填写',
            },
            {
              validator: checkOldPassword,
            },
          ],
          initialValue: '',
        })(<Input placeholder="请输入原密码" type="password" />)}
      </FormItem>
      <FormItem
        help={help}
        label="新密码"
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        <Popover
          content={
            <div style={{ padding: '4px 0' }}>
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress()}
              <div style={{ marginTop: 10 }}>
                请至少输入 6 个字符，不要使用容易被猜到的密码。
                    </div>
            </div>
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={visible}
        >
          {form.getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码！' },
              { validator: checkPassword1 },
            ],
            initialValue: '',
          })(
            <Input type="password" placeholder="请设置登录密码" />,
          )}
        </Popover>
      </FormItem>
      <FormItem
        label="再次输入"
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        {form.getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: checkConfirm,
            },
          ],
          initialValue: '',
        })(<Input type="password" placeholder="请再次输入密码" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(PassModal);
