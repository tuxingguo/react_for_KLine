import request from '@/utils/request';

export async function checkUserName(value) {
    return request('/server/register/checkUserName', {
        method: 'POST',
        data: value,
    });
}

export async function updateMyInfo(value) {
    return request('/server/updateInfo/updateMyInfo', {
        method: 'POST',
        data: value,
    });
}

export async function getUserInfoById(params) {
    return request('/server/user/getUserInfoById', {
        method: 'POST',
        data: { ...params, method: 'post' },
    });
}

export async function updatePassword(value) {
    return request('/server/updateInfo/updatePassword', {
        method: 'POST',
        data: value,
    });
}

export async function updateMyFund(value) {
    return request('/server/updateInfo/updateMyFund', {
        method: 'POST',
        data: value,
    });
}

export async function confirmOldPassword(value) {
    return request('/server/myAccount/checkOldPassword', {
        method: 'POST',
        data: value,
    });
}
