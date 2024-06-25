import Api from '../api';

const api = new Api({});

export async function getUserPlaylists(userId) {
    let options = {
        url: `/playlist/user/${userId}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
