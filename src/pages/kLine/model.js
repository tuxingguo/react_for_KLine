import { queryData, queryData2 } from './service';

const Model = {
  namespace: 'kLine',
  state: {
    rawData: [],
  },
  // effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理
  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(queryData, payload);
      yield put({ // //将数据交给reducer处理
        type: 'save',
        payload: response,
      });
    },
    *refresh2({ payload }, { call, put }) {
      const response = yield call(queryData2, payload);
      yield put({ // //将数据交给reducer处理
        type: 'save',
        payload: response,
      });
    },
  },
  // reducers：将数据返回给页面
  reducers: {
    save(state, action) {
      return { ...state, rawData: action.payload };
    },
  },
};
export default Model;
