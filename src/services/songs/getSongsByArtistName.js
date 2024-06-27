import Api from '../api';

const api = new Api({});

export async function getSongsByArtistName(artistName) {
    let options = {
        url: `/songs/artistName?artistName=${artistName}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
