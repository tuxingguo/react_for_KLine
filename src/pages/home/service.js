import request from '@/utils/request';

export async function getUserInfoById(params) {
  return request('/server/user/getUserInfoById', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}

export async function getRateOfReturn(params) {
  return request('/server/user/getRateOfReturn', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}

export async function getProfitByUserId(params) {
  return request('/server/user/getProfitByUserId', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}

export async function getCategoryProfit(params) {
  return request('/server/user/getCategoryProfit', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
