import Api from '../api';

const api = new Api({});

export async function createPlaylist(playlist) {
    let options = {
        url: "/playlist",
    };

    try {
        const res = await api.post(playlist, options);
        return res;
    } catch (error) {
        throw error;
    }
}