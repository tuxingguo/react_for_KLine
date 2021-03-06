import { queryNextTick1MinData, calculateProfit, getUserInfoById,
  queryOriginTickData, saveOrder, trainRecord } from './service';

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
    orderPrice: 0,
    fields: [],
    initialInterest: 1000000,

    currentInterest: 1000000, // 当前权益设置为100,0000
    availableFund: 1000000, // 可用设置为100,0000
    availableFundFix: 1000000,
    tempProfitClose: 0,
    tempCurrentInterest: 1000000,
    bond: 0,

    start: 0,
    end: 0,
    mainContract: null, // 主力合约
    tradingDay: null, // 交易日

    strategyIsOpen: false, // 默认策略不开启
    option: null,
    trainId: null,
  },

  effects: {

    *getOriginTickData({ payload }, { call, put }) {
      const response = yield call(queryOriginTickData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getNextTick({ payload, callback }, { call, put }) {
      const response = yield call(queryNextTick1MinData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
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
    *saveOrder({ payload, callback }, { call, put }) {
      const response = yield call(saveOrder, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
    *trainRecord({ payload, callback }, { call, put }) {
      const response = yield call(trainRecord, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      if (callback) callback();
    },
  },

  // reducers：将数据返回给页面
  reducers: {
    save(state, action) {
      const len = action.payload.json_list.length;
      let lt = []
      if (len < 2) {
        lt = action.payload.json_list[len - 1];
      } else {
        lt = action.payload.json_list[len - 2];
      }

      return {
        ...state,
        nextTick: action.payload.json_list.splice(len - 1, len)[0],
        lastTick: lt,
        tickData: action.payload.json_list,
        isOver: action.payload.isOver,
        advisePrice: lt[2],
        mainContract: action.payload.mainContract,
        tradingDay: action.payload.tradingDay,
        start: action.payload.start,
        end: action.payload.end,
      };
    },
    update(state, action) {
      return { ...state, data: action.payload };
    },
    get(state, action) {
      return {
        ...state,
        // currentInterest: action.payload.currentInterest,
        // availableFund: action.payload.availableFund,
        // tempCurrentInterest: action.payload.currentInterest,
      };
    },
  },
};
export default Model;
