import Api from '../api';

const api = new Api({});

export async function isPlaylistOwner(playlistId) {
    let options = {
        url: `/playlist/isOwner/${playlistId}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
