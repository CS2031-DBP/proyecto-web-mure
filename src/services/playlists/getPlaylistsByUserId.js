import Api from '../api';

const api = new Api({});

export async function getUserPlaylists(userId, page = 0, size = 10) {
    let options = {
        url: `/playlist/user/${userId}?page=${page}&size=${size}`,
    }; 

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
