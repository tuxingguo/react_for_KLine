import request from '@/utils/request';

export async function queryCategoryList(params) {
  return request('/server/category/queryCategoryList', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
