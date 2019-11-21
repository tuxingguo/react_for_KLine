import { checkUserName } from './service';

const Model = {
    namespace: 'myAccount',
    state: {
        data: [],
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
    },
    // reducers：将数据返回给页面
    reducers: {
        userNameHandle(state, { payload }) {
            return {
                ...state,
                userNameMsg: payload.userNameMsg,
            };
        },
    },
};
export default Model;
