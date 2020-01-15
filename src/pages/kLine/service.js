import request from '@/utils/request';

// export async function queryTick1MinData() {
//   return request('server/kLine/queryTick1MinData');
// }

export async function queryOriginTickData(params) {
  return request('/server/kLine/queryOriginTickData', {
    method: 'POST',
    data: { ...params },
  });
}

export async function queryNextTick1MinData(params) {
  return request('/server/kLine/queryNextTick1MinData', {
    method: 'POST',
    data: { ...params },
  });
}

export async function calculateProfit(params) {
  return request('/server/kLine/calculateProfit', {
    method: 'POST',
    data: { ...params },
  });
}

export async function getUserInfoById(params) {
  return request('/server/user/getUserInfoById', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}

export async function saveOrder(params) {
  return request('/server/order/saveOrder', {
    method: 'POST',
    data: { ...params },
  });
}

export async function trainRecord(params) {
  return request('/server/order/trainRecord', {
    method: 'POST',
    data: { ...params },
  });
}
