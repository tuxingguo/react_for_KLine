import request from '@/utils/request';

export async function checkUserName(value) {
    return request('/server/register/checkUserName', {
        method: 'POST',
        data: value,
    });
}
