import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT } from '../../layout';
import PageCard from '../../components/PageCard';

const FormItem = Form.Item;

@connect(({ myAccount, user }) => ({
    myAccount,
    currentUser: user.currentUser,
}))

@Form.create()
export default class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    handleUserName = (rule, value, callback) => {
        const { dispatch } = this.props;
        const { currentUser = {} } = this.props;
        if (value !== null && value !== '' && value !== currentUser.userName) {
            dispatch({
                type: 'myAccount/checkUserName',
                payload: {
                    value,
                },
            }).then(resp => {
                if (resp.userNameMsg === 'illegal') {
                    callback(formatMessage({ id: 'user-register.userName.employ' }));
                } else {
                    callback();
                }
            });
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <PageCard title="基本信息">
                <div>
                    <Form>
                        <Row gutter={8} >
                            <Col span={16}>
                                <FormItem
                                    label="邮 箱"
                                    {...FORM_ITEM_LAYOUT.formItemLayout34}
                                >
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({ id: 'user-register.email.required' }),
                                            },
                                            {
                                                type: 'email',
                                                message: formatMessage({ id: 'user-register.email.wrong-format' }),
                                            },
                                        ],
                                        initialValue: '1207043975@qq.com',
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={16}>
                                <FormItem
                                    label="用户名"
                                    {...FORM_ITEM_LAYOUT.formItemLayout34}
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: formatMessage({ id: 'user-register.userName.required' }),
                                            },
                                            {
                                                validator: this.handleUserName,
                                            },
                                        ],
                                        initialValue: 'admin',
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </PageCard>
        );
    }
}
