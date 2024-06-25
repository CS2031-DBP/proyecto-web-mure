import Api from '../api';

const api = new Api({});

export async function fetchUserFriends() {
    let options = {
        url: '/user/friends/me',
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}