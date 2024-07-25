import Api from '../api';

const api = new Api({});

export async function getAlbumById(albumId) {
    let options = {
        url: `/album/${albumId}`
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}