import Api from '../api';

const api = new Api({});

export async function getSongsByAlbumId(albumId) {
    let options = {
        url: `/songs/album/${albumId}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
