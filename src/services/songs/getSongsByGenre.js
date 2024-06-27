import Api from '../api';

const api = new Api({});

export async function getSongsByGenre(genre) {
    let options = {
        url: `/songs/genre?genre=${genre}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
