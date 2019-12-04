import request from '@/utils/request';
import { UserRegisterParams } from './index';

export async function register(params: UserRegisterParams) {
  // console.log('params=', params);
  return request('/server/register', {
    method: 'POST',
    data: params,
  });
}

export async function checkUserName(value: object) {
  return request('/server/register/checkUserName', {
    method: 'POST',
    data: value,
  });
}
