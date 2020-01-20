import { checkUserName, updateMyInfo, getUserInfoById, updatePassword,
    updateMyFund, confirmOldPassword, getUserSituation } from './service';

const Model = {
    namespace: 'myAccount',
    state: {
        data: [],
        userName: '',
        email: '',
        profile: '',
        password: '',
        PwdStrength: '',
        availableFund: 0.00,

        maxRateOfReturn: 0,
        profitRate: 0,
        avgRisk: 0,
        countProfit: 0,
        countLoss: 0,
        maxRateOfRetrace: 0,
        sumHandNum: 0,
    },
    // effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理
    effects: {
        *checkUserName({ payload }, { call, put }) {
            const response = yield call(checkUserName, payload);
            yield put({
                type: 'userNameHandle',
                payload: response,
            });
            return response;
        },
        *updateInfo({ payload, callback }, { call, put }) {
            const response = yield call(updateMyInfo, payload);
            yield put({
                type: 'update',
                payload: response,
            });
            return response;
        },
        *getUserInfo({ payload, callback }, { call, put }) {
            const response = yield call(getUserInfoById, payload);
            yield put({
                type: 'get',
                payload: response,
            });
            if (callback && typeof callback === 'function') {
                callback(response); // 返回结果
            }
        },
        *updatePassword({ payload, callback }, { call, put }) {
            const response = yield call(updatePassword, payload);
            yield put({
                type: 'update',
                payload: response,
            });
            if (callback && typeof callback === 'function') {
                callback(response); // 返回结果
            }
        },
        *updateMyFund({ payload, callback }, { call, put }) {
            const response = yield call(updateMyFund, payload);
            yield put({
                type: 'update',
                payload: response,
            });
            if (callback && typeof callback === 'function') {
                callback(response); // 返回结果
            }
        },
        *confirmOldPassword({ payload }, { call, put }) {
            const response = yield call(confirmOldPassword, payload);
            yield put({
                type: 'checkPwd',
                payload: response,
            });
            return response;
        },
        *getUserSituation({ payload, callback }, { call, put }) {
            const response = yield call(getUserSituation, payload);
            yield put({
                type: 'getSitu',
                payload: response,
            });
            return response;
        },
    },
    // reducers：将数据返回给页面
    reducers: {
        userNameHandle(state, { payload }) {
            return {
                ...state,
                userNameMsg: payload.userNameMsg,
            };
        },
        update(state, { payload }) {
            return {
                ...state,
            };
        },
        get(state, action) {
            return {
                ...state,
                userName: action.payload.userName,
                email: action.payload.email,
                profile: action.payload.profile,
                password: action.payload.password,
                availableFund: action.payload.availableFund,
                PwdStrength: action.payload.PwdStrength,
            };
        },
        checkPwd(state, { payload }) {
            return {
                ...state,
            };
        },
        getSitu(state, action) {
            console.log('action.payload=', action.payload);
            return {
                ...state,
                maxRateOfReturn: action.payload.maxRateOfReturn,
                profitRate: action.payload.profitRate,
                avgRisk: action.payload.avgRisk,
                countProfit: action.payload.countProfit,
                countLoss: action.payload.countLoss,
                maxRateOfRetrace: action.payload.maxRateOfRetrace,
                sumHandNum: action.payload.sumHandNum,
            };
        },
    },
};
export default Model;
