import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, List, Popconfirm, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT } from '../../layout';
import PageCard from '../../components/PageCard';
import PassModal from './components/PassModal';
import FundModal from './components/FundModal';

const FormItem = Form.Item;

@connect(({ myAccount, user }) => ({
    myAccount,
    currentUser: user.currentUser,
    user,
}))

@Form.create()
export default class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passVisible: false,
            fundVisible: false,
            help: '',
            visible: false,
            confirmDirty: false,
        };
    }

    componentWillMount() {
        this.refreshAccountInfo();
    }

    refreshAccountInfo = () => {
        const { currentUser = {} } = this.props;
        const { dispatch } = this.props;
        dispatch({
            type: 'myAccount/getUserInfo',
            payload: {
                userId: currentUser.userId,
            },
            callback: res => {
                this.props.myAccount.userName = res.userName;
                this.props.myAccount.email = res.email;
                this.props.myAccount.profile = res.profile;
                this.props.myAccount.password = res.password;
                this.props.myAccount.availableFund = res.availableFund;
            },
        });
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
        } else if (value === null || value === '') {
            callback();
        } else {
            callback();
        }
    };

    handleEdit = key => {
        if (key === 1) {
            this.setState({
                passVisible: true, // 重新渲染
            });
        } else if (key === 2) {
            // 判断下资金是否充足
            const fund = this.props.myAccount.availableFund;
            if (fund >= 10000000) {
                message.warn('当前可用资金较为充足，暂不能入金');
                return;
            }
            this.setState({
                fundVisible: true, // 重新渲染
            });
        }
    }

    updateInfo = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            const { userName, email, profile } = values;
            const { currentUser = {} } = this.props;
            const { dispatch } = this.props;
            dispatch({
                type: 'myAccount/updateInfo',
                payload: {
                    userId: currentUser.userId,
                    userName,
                    email,
                    profile,
                },
            }).then(resp => {
                if (resp.status === 200) {
                    message.success('修改成功');
                } else {
                    message.success('修改失败');
                }
            });
            this.refreshAccountInfo();
            dispatch({
                type: 'user/fetchCurrent',
            });
        });
    }

    confirmPass = fieldsValue => {
        this.setState({
            passVisible: false,
            help: '',
            visible: false,
        });
        const { dispatch } = this.props;
        const { currentUser = {} } = this.props;
        dispatch({
            type: 'myAccount/updatePassword',
            payload: {
                userId: currentUser.userId,
                password: fieldsValue.password,
            },
            callback: res => {
                if (res.status === 200) {
                    message.success('密码修改成功');
                } else {
                    message.success('密码修改失败');
                }
                this.refreshAccountInfo();
            },
        });
    };

    cancelPass = () => {
        this.setState({
            passVisible: false,
            help: '',
            visible: false,
        });
    };

    confirmOldPassword = (rule, value, callback) => {
        const { dispatch } = this.props;
        const { currentUser = {} } = this.props;
        dispatch({
            type: 'myAccount/confirmOldPassword',
            payload: {
                userId: currentUser.userId,
                value,
            },
        }).then(res => {
            if (res.pwd_bool === false) {
                callback('原密码输入有误!');
            } else {
                callback();
            }
        });
    }

    checkPassword = (rule, value, callback, form2) => {
        if (!value) {
            this.setState({
                help: '请输入密码！',
                visible: !!value,
            });
            callback('error');
        } else {
            this.setState({
                help: '',
            });
            if (!this.state.visible) {
                this.setState({
                    visible: !!value,
                });
            }
            if (value.length < 6) {
                callback('error');
            } else {
                if (value && this.state.confirmDirty) {
                    form2.validateFields(['confirm'], { force: true });
                }
                callback();
            }
        }
    };

    cancelFund = () => {
        this.setState({
            fundVisible: false,
        });
    };

    confirmFund = fieldsValue => {
        this.setState({
            fundVisible: false,
        });
        const { fund } = fieldsValue;
        const { currentUser = {} } = this.props;
        const { dispatch } = this.props;
        dispatch({
            type: 'myAccount/updateMyFund',
            payload: {
                userId: currentUser.userId,
                fund,
            },
            callback: res => {
                if (res.status === 200) {
                    message.success('入金成功');
                } else {
                    message.success('入金失败');
                }
                this.refreshAccountInfo();
            },
        });
    }

    render() {
        const { userName, email, profile, PwdStrength, availableFund } = this.props.myAccount;
        const { getFieldDecorator } = this.props.form;
        const data = [
            {
                key: 1,
                title: '账户密码',
                description: '当前密码强度：',
                result: PwdStrength === 'middle' ? '中' : '强',
            },
            {
                key: 2,
                title: '入金管理',
                description: '当前可用资金：',
                result: `￥ ${availableFund.toFixed(2)}`,
            },
        ];
        const { passVisible, help, visible, fundVisible } = this.state;
        const parentMethods = {
            confirmPass: this.confirmPass,
            cancelPass: this.cancelPass,
            checkPassword: this.checkPassword,
            confirmOldPassword: this.confirmOldPassword,
        };

        const parentMethods2 = {
            confirmFund: this.confirmFund,
            cancelFund: this.cancelFund,
        };

        return (
            <div>
                <PageCard title="基本信息">
                    <Form>
                        <Row gutter={8} >
                            <Col span={16} style={{ marginLeft: '6%' }}>
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
                                        initialValue: email,
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={16} style={{ marginLeft: '6%' }}>
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
                                        initialValue: userName,
                                    })(
                                        <Input />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={16} style={{ marginLeft: '6%' }}>
                                <FormItem
                                    label="个人简介"
                                    {...FORM_ITEM_LAYOUT.formItemLayout34}
                                >
                                    {getFieldDecorator('profile', {
                                        rules: [
                                            {
                                                required: false,
                                            },
                                        ],
                                        initialValue: profile === undefined ? '' : profile,
                                    })(
                                        <Input.TextArea
                                            placeholder="介绍下自己吧~"
                                            rows={4}
                                        />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{ marginTop: '2%' }}>
                            <Popconfirm title="确定要更新吗？" onConfirm={() => this.updateInfo()}>
                                <Button type="primary" style={{ width: '15%', marginLeft: '28%' }}>更新基本信息</Button>
                            </Popconfirm>
                        </div>
                    </Form>
                </PageCard >
                <PageCard title="安全设置">
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item
                                actions={[<a key={item.key}
                                    onClick={() => this.handleEdit(item.key)}>修改</a>]}
                            >
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.description + item.result}
                                />
                            </List.Item>
                        )}
                    />
                </PageCard>
                <PassModal {...parentMethods} modalVisible={passVisible} help={help}
                    visible={visible} PwdStrength={PwdStrength} />
                <FundModal {...parentMethods2} modalVisible={fundVisible} />
            </div>
        );
    }
}
