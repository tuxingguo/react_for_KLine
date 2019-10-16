import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { register, checkUserName } from './service';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  userNameMsg?: 'legal' | 'illegal';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    status: undefined,
    userNameMsg: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *checkUserName({ payload }, { call, put }) {
      const response = yield call(checkUserName, payload);
      yield put({
        type: 'userNameHandle',
        payload: response,
      });
      return response;
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    userNameHandle(state, { payload }) {
      return {
        ...state,
        userNameMsg: payload.userNameMsg,
      };
    },
  },
};

export default Model;
