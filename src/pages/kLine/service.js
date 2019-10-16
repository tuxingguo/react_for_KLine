import request from '@/utils/request';

export async function queryData() {
  return request('api/queryData');
}
export async function queryData2() {
  return request('api/queryData2');
}
