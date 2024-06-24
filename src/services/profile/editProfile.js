import Api from '../api';

const api = new Api({ });

export function editProfile(data) {
    let options = {
        url: '/user/update/me',
    };

    return api.patch(data, options)
        .then(res => {
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            return res;
        })
        .catch(error => {
            return error;
        });
}