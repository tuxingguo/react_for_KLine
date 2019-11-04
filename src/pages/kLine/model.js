import { queryNextTick1MinData, calculateProfit, getUserInfoById } from './service';

const Model = {
  namespace: 'kLine',
  state: {
    tickData: [],
    isOver: false,
    count: 0,
    nextTick: [],
    lastTick: [],
    positionData: [],
    handNum: 1,
    direction: '1',
    openOrClose: '1',
    advisePrice: 0,
    profitClose: 0,
    profit: 0,
    overVisible: false,
    orderPrice: 0,
    fields: [],

    currentInterest: 0,
    availableFund: 0,
  },

  effects: {

    *getNextTick({ payload }, { call, put }) {
      const response = yield call(queryNextTick1MinData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *calculateProfit({ payload, callback }, { call, put }) {
      const response = yield call(calculateProfit, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
    *getUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfoById, payload);
      yield put({
          type: 'get',
          payload: response,
      });
      if (callback) callback();
  },
  },

  // reducers：将数据返回给页面
  reducers: {
    save(state, action) {
      const len = action.payload.json_list.length;

      return {
        ...state,
        nextTick: action.payload.json_list.splice(len - 1, len)[0],
        lastTick: action.payload.json_list[len - 2],
        tickData: action.payload.json_list,
        isOver: action.payload.isOver,
        overVisible: action.payload.isOver === true,
        advisePrice: action.payload.json_list[len - 2][2],
      };
    },
    update(state, action) {
      return { ...state, data: action.payload };
    },
    get(state, action) {
      return {
        ...state,
        currentInterest: action.payload.currentInterest,
        availableFund: action.payload.availableFund,
      };
    },
  },
};
export default Model;
