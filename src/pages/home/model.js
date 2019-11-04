import { getUserInfoById } from './service';

const Model = {
    namespace: 'home',
    state: {
        InitialInterest: 0,
        bond: 0,
        profitInPosition: 0,
        profitInClosePosition: 0,
        currentInterest: 0,
        availableFund: 0,
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
    },
    // reducers：将数据返回给页面
    reducers: {
        save(state, action) {
            return {
                ...state,
                InitialInterest: action.payload.InitialInterest,
                bond: action.payload.bond,
                profitInPosition: action.payload.profitInPosition,
                profitInClosePosition: action.payload.profitInClosePosition,
                currentInterest: action.payload.currentInterest,
                availableFund: action.payload.availableFund,
            };
        },
    },
};
export default Model;
