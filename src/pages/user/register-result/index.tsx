import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <a href="">
      {/* <Button size="large" type="primary">
        <FormattedMessage id="user-register-result.register-result.view-mailbox" />
      </Button> */}
    </a>
    <Link to="/user/login">
      <Button size="large" type="primary">
        {/* <FormattedMessage id="user-register-result.register-result.back-home" /> */}
        返回登录页
      </Button>
    </Link>
  </div>
);

const RegisterResult: React.FC<RouteChildrenProps> = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        <FormattedMessage
          id="user-register-result.register-result.msg"
          values={{ email: location.state ? location.state.account : '' }}
        />
      </div>
    }
    // subTitle={formatMessage({ id: 'user-register-result.register-result.activation-email' })}
    subTitle={'您已经成功注册该系统，赶紧使用起来吧，期货大家庭期待你的加入！'}
    extra={actions}
  />
);

export default RegisterResult;
