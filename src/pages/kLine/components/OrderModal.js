import { Modal, Descriptions } from 'antd';
import React from 'react';

const OrderModal = props => {
  const { modalVisible, confirmOrder, cancelOrder, instrumentId, direction,
    openOrClose, handNum, orderprice } = props;
  const handleOk = () => {
    confirmOrder()
  };

  const handleCancel = () => {
    cancelOrder()
  };

  return (
    <Modal
      destroyOnClose
      closable={false}
      maskClosable={false}
      visible={modalVisible}
      onCancel={() => handleCancel()}
      onOk={() => handleOk()}
    >
      <Descriptions title="报单详情">
        <Descriptions.Item label="合约">{instrumentId}</Descriptions.Item>
        <Descriptions.Item label="方向">{direction === '1' ? '买入' : '卖出'}</Descriptions.Item>
        <Descriptions.Item label="开平">{openOrClose === '1' ? '开仓' : '平仓'}</Descriptions.Item>
        <Descriptions.Item label="价格">{orderprice}元</Descriptions.Item>
        <Descriptions.Item label="手数">{handNum}手</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default OrderModal;
