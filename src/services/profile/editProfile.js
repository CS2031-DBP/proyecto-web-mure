import Api from '../api';

const api = new Api({ });

export async function editProfile(data) {
    let options = {
        url: '/user/update/me',
    };

    try {
        console.log(data);
        const res = await api.patch(data, options);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        console.log(res);
        return res;
    } catch (error) {
        throw error;
    }
}