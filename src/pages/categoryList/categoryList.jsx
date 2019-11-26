import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Icon, Input, Table } from 'antd';
import router from 'umi/router';
import PageCard from '../../components/PageCard';
import { BASE_PAGINATION } from '../../layout';

const FormItem = Form.Item;

@connect(({ category, kLine }) => ({
    category,
    kLine,
}))

@Form.create()
export default class PerformanceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: { current: 1, ...BASE_PAGINATION },
            sorter: { field: '', order: '' },
            searchKey: '',
        };
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'category/getCategoryList',
            payload: {
                key: this.state.searchKey,
            },
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.state.pagination = pagination;
        this.state.sorter = sorter;
        this.fetch();
    }

    handleTrain = r => {
        router.push({
            pathname: '/categoryList/kLine',
            state: { // state字段可以自定义，如用params等也可以
                TRANSCODE: r.TRANSCODE,
                HYCS: r.HYCS,
                ZXDBJ: r.ZXDBJ,
                BZJB: r.BZJB,
                TRANSETYPE: r.TRANSETYPE,
            },
        });
    }

    handleSearchKeyChange = e => {
        this.setState({
            searchKey: e.target.value,
        });
      }

    handleSearch() {
        this.state.pagination.current = 1;
        this.fetch();
      }

    render() {
        const {
            category: { data },
        } = this.props;

        const actions = r => (
            <a onClick={() => this.handleTrain(r)}>训练</a>
        );

        const columns = [
            {
                title: '品种代码',
                dataIndex: 'TRANSCODE',
                align: 'center',
            },
            {
                title: '品种名称',
                dataIndex: 'TRANSETYPE',
                align: 'center',
            },
            {
                title: '交易所',
                dataIndex: 'MARKET',
                align: 'center',
            },
            {
                title: '合约乘数',
                dataIndex: 'TRANSUNIT',
                align: 'center',
            },
            {
                title: '最小变动价',
                dataIndex: 'MINPCHANGE',
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'id',
                align: 'center',
                render:
                    (t, r) => (
                        <div>
                            <div>
                                {actions(r)}
                            </div>
                        </div>
                    ),
            }];

        return (
            <PageCard title="品种列表">
                <div style={{ marginBottom: 24 }}>

                    <div style={{ float: 'right' }}>
                        <Form layout="inline">
                            <FormItem style={{ marginRight: 3 }}>
                                <Input
                                    style={{ width: 160 }}
                                    placeholder="品种代码/名称"
                                    prefix={<Icon type="search" />}
                                    onChange={this.handleSearchKeyChange}
                                    // value={this.state.searchKey}
                                    onPressEnter={() => this.handleSearch()}
                                />
                            </FormItem>
                            <FormItem style={{ marginRight: 0 }}>
                                <Button size="default" type="primary" onClick={() => this.handleSearch()}>查询</Button>
                                <Button size="default" style={{ marginLeft: 3 }}>刷新</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <Table
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={data}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    bordered={false}
                />
            </PageCard>
        );
    }
}
