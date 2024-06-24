import Api from '../api';

const api = new Api({ });

export async function fetchUserPosts() {
    let options = {
        url: '/post/me',
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        return error;
    }
}