import { Modal, Button } from 'antd';
import React from 'react';


const OverModal = props => {
  const { modalVisible, confirmOver } = props;
  const handleOk = () => {
    confirmOver();
  };

  return (
    <Modal
      destroyOnClose
      closable={false}
      maskClosable={false}
      title="测试结果"
      visible={modalVisible}
      footer={[
          <Button key="submit" type="primary" onClick={() => handleOk()}>确定</Button>]}
    >
      <p>测试结束...</p>
    </Modal>
  );
};

export default OverModal;
