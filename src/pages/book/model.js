import { queryBook, addBook, removeBook, updateBook } from './service';

const Model = {
  namespace: 'bookList',
  state: {
    data: [],
  },
  // effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryBook, payload);
      yield put({ // //将数据交给reducer处理
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addBook, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeBook, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateBook, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  // reducers：将数据返回给页面
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
