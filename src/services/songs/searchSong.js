import Api from '../api';

const api = new Api({});

export async function searchSong(title) {
    let options = {
        url: `/songs/title?title=${title}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
