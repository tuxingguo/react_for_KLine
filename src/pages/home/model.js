import {
    getUserInfoById, getRateOfReturn, getProfitByUserId, getCategoryProfit,
    getCategoryHand, getRetracement, getAccountRisk
} from './service';

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
        handDataList: [],
        rateOfRetracement: [],
        rateOfRisk: [],
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
            if (callback && typeof callback === 'function') {
                callback(response); // 返回结果
            }
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
        *getCategoryHand({ payload, callback }, { call, put }) {
            const response = yield call(getCategoryHand, payload);
            yield put({
                type: 'getHand',
                payload: response,
            });
            if (callback) callback();
        },
        *getRetracement({ payload, callback }, { call, put }) {
            const response = yield call(getRetracement, payload);
            yield put({
                type: 'getRetrace',
                payload: response,
            });
            if (callback) callback();
        },
        *getAccountRisk({ payload, callback }, { call, put }) {
            const response = yield call(getAccountRisk, payload);
            yield put({
                type: 'getRisk',
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
        getHand(state, action) {
            return {
                ...state,
                handDataList: action.payload.handDataList,
            };
        },
        getRetrace(state, action) {
            return {
                ...state,
                rateOfRetracement: action.payload.rateOfRetracement,
            };
        },
        getRisk(state, action) {
            return {
                ...state,
                rateOfRisk: action.payload.rateOfRisk,
            };
        },
    },
};
export default Model;
