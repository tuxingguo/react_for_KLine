import { getUserInfoById, getRateOfReturn, getProfitByUserId, getCategoryProfit } from './service';

const Model = {
    namespace: 'home',
    state: {
        InitialInterest: 0,
        bond: 0,
        profitInPosition: 0,
        profitInClosePosition: 0,
        currentInterest: 0,
        availableFund: 0,
        rateOfReturn: [],
        trainOverTime: [],
        allProfit: [],
        cateDataList: [],
    },
    // effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理
    effects: {
        *getUserInfo({ payload, callback }, { call, put }) {
            const response = yield call(getUserInfoById, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if (callback) callback();
        },
        *getRateOfReturn({ payload, callback }, { call, put }) {
            const response = yield call(getRateOfReturn, payload);
            yield put({
                type: 'getReturn',
                payload: response,
            });
            if (callback) callback();
        },
        *getProfitByUserId({ payload, callback }, { call, put }) {
            const response = yield call(getProfitByUserId, payload);
            yield put({
                type: 'getProfit',
                payload: response,
            });
            if (callback) callback();
        },
        *getCategoryProfit({ payload, callback }, { call, put }) {
            const response = yield call(getCategoryProfit, payload);
            yield put({
                type: 'getCategory',
                payload: response,
            });
            if (callback) callback();
        },
    },
    // reducers：将数据返回给页面
    reducers: {
        save(state, action) {
            return {
                ...state,
            };
        },
        getReturn(state, action) {
            return {
                ...state,
                rateOfReturn: action.payload.rateOfReturn,
                trainOverTime: action.payload.trainOverTime,
            };
        },
        getProfit(state, action) {
            return {
                ...state,
                allProfit: action.payload.allProfit,
            };
        },
        getCategory(state, action) {
            return {
                ...state,
                cateDataList: action.payload.cateDataList,
            };
        },
    },
};
export default Model;
