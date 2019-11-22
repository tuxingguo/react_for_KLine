import { checkUserName, updateMyInfo, getUserInfoById, updatePassword, updateMyFund } from './service';

const Model = {
    namespace: 'myAccount',
    state: {
        data: [],
        userName: '',
        email: '',
        profile: '',
        password: '',
        availableFund: 0.00,
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
            if (callback) callback();
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
            };
        },
    },
};
export default Model;
