import Api from '../api';

const api = new Api({ });

export async function editProfile(data) {
    let options = {
        url: '/user/update/me',
    };

    try {

        const res = await api.patchForm(data, options);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }

        return res;
    } catch (error) {
        throw error;
    }
}