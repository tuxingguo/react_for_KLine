import { Modal, Button, Rate } from 'antd';
import React from 'react';


const OverModal = props => {
  const { modalVisible, confirmOver, rateLevel } = props;
  const handleOk = () => {
    confirmOver();
  };

  const desc = ['不要气馁哦！', '继续加油！', '不错哦！', '干得好！', '你太棒了！'];
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
      <span>
        <Rate disabled defaultValue={rateLevel} />
        {rateLevel ? <span className="ant-rate-text">{desc[rateLevel - 1]}</span> : ''}
      </span>
    </Modal>
  );
};

export default OverModal;
