import Api from '../api';

const api = new Api({});

export async function likeAlbum(albumId) {
    let options = {
        url: `/album/like/${albumId}`
    };

    try {
        const res = await api.patch({}, options);
        return res;
    } catch (error) {
        throw error;
    }
}