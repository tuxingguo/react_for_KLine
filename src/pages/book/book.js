import { Table, Divider, Button, Form, message } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import CreateForm from './components/CreateForm';

const { Column } = Table;

@connect(({ bookList }) => ({
  bookList,
}))
class TableTest extends Component {
  state = {
    modalVisible: false,
    bookValues: {},
    bookId: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookList/fetch',
    });
  }

  handleModalVisible = flag => {
    this.setState({
      bookValues: {},
      bookId: undefined,
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookList/add',
      payload: {
        bookName: fields.bookName,
        author: fields.author,
        price: fields.price,
        publish: fields.publish,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdateBook = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookList/update',
      payload: {
        id: this.state.bookId,
        bookName: fields.bookName,
        author: fields.author,
        price: fields.price,
        publish: fields.publish,
      },
    });
    message.success('修改成功');
    this.handleModalVisible();
  };

  handleRemove = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookList/remove',
      payload: {
        id,
      },
    });
    message.success('删除成功');
  }

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      bookValues: record,
      bookId: record.id,
    });
  };

  render() {
    const {
      bookList: { data },
    } = this.props;
    const { modalVisible, bookValues, bookId } = this.state;

    const parentMethods = {
      handleUpdateBook: this.handleUpdateBook,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <Button style={{ margin: 15 }} type="primary" icon="plus" ghost onClick={() => this.handleModalVisible(true)} >
          add
        </Button>
        <Table dataSource={data} rowKey={record => record.id}>
          <Column
            title="书名"
            dataIndex="bookName"
            key="nambookNamee"
          />
          <Column
            title="作者"
            dataIndex="author"
            key="author"
          />
          <Column
            title="价格"
            dataIndex="price"
            key="price"
          />
          <Column
            title="出版社"
            dataIndex="publish"
            key="publish"
          />
          <Column
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Button type="danger" icon="delete" onClick={ () => this.handleRemove(record.id)} >Delete</Button>
                <Divider type="vertical" />
                <Button icon="edit" onClick={() => this.handleUpdateModalVisible(true, record)} >Edit</Button>
              </span>
            )}
          />
        </Table>
        <CreateForm {...parentMethods} modalVisible={modalVisible} values={bookValues}
          booId={bookId} />
      </div>
    );
  }
}
export default Form.create()(TableTest);
