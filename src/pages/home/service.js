import request from '@/utils/request';

export async function getUserInfoById(params) {
  return request('/server/user/getUserInfoById', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
