import { Form, Input, Modal } from 'antd';
import React from 'react';

const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible,
    values, booId, handleUpdateBook } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const handleUpdate = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdateBook(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      // "添加图书"
      title={ booId === undefined ? '添加图书' : '修改图书'}
      visible={modalVisible}
      onOk={ booId === undefined ? okHandle : handleUpdate }
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="书名"
      >
        {form.getFieldDecorator('bookName', {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: values.bookName,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="作者"
      >
        {form.getFieldDecorator('author', {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: values.author,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="价格"
      >
        {form.getFieldDecorator('price', {
          rules: [
            {
              required: false,
            },
          ],
          initialValue: values.price,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{
          span: 5,
        }}
        wrapperCol={{
          span: 15,
        }}
        label="出版社"
      >
        {form.getFieldDecorator('publish', {
          rules: [
            {
              required: false,
            },
          ],
          initialValue: values.publish,
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
