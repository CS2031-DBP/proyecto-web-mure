import Api from '../api';

const api = new Api({});

export async function dislikeAlbum(albumId) {
    let options = {
        url: `/album/dislike/${albumId}`
    };

    try {
        const res = await api.patch({}, options);
        return res;
    } catch (error) {
        throw error;
    }
}
