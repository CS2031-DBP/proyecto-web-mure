import Api from '../api';

const api = new Api({});

export async function fetchCurrentUser() {
    let options = {
        url: '/user/me',
    };

    try {
        const res = await api.get(options);
        return res.data;
    } catch (error) {
        throw error;
    }
}
