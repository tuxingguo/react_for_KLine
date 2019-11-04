import { queryCategoryList } from './service';

const Model = {
    namespace: 'category',
    state: {
        data: [],
    },
    // effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理
    effects: {
        *getCategoryList({ payload, callback }, { call, put }) {
            const response = yield call(queryCategoryList, payload);
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
                data: action.payload,
            };
        },
    },
};
export default Model;
