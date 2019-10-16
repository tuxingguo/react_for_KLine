import request from '@/utils/request';

export async function queryBook() {
  return request('server/book/queryBook');
}

export async function addBook(params) {
  return request('server/book/addBook', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}

export async function removeBook(params) {
  return request('server/book/deleteBook', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}

export async function updateBook(params) {
  return request('server/book/updateBook', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
