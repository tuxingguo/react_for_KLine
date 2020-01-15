import { Modal, Radio } from 'antd';
import React from 'react';
import Center from '@/pages/account/center';

const CycleOption = props => {
  const { modalVisible, confirmCycle, cancelCycle, cycle, shiftCycle } = props;
  const handleOk = () => {
    confirmCycle();
  };

  const handleCancel = () => {
    cancelCycle();
  };

  const handleSizeChange = value => {
    shiftCycle(value);
  };

  return (
    <Modal
      destroyOnClose
      title="K线周期选择"
      closable={false}
      maskClosable={false}
      visible={modalVisible}
      onCancel={() => handleCancel()}
      onOk={() => handleOk()}
    >
      <div style={{ marginLeft: '8%', width: '100%' }} >
        <Radio.Group value={cycle} onChange={handleSizeChange} style={{ width: '80%', textAlign: 'Center' }}>
            <Radio.Button value={1} style={{ width: '25%' }}>1分钟</Radio.Button>
            <Radio.Button value={2} style={{ width: '25%' }}>5分钟</Radio.Button>
            <Radio.Button value={3} style={{ width: '25%' }}>一天</Radio.Button>
          </Radio.Group>
      </div>
    </Modal>
  );
};

export default CycleOption;
