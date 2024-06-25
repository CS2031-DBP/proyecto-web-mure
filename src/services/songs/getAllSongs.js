import Api from '../api';

const api = new Api({ });

export async function fetchSongs(page, size) {
    let options = {
        url: `/songs/songs/all?page=${page}&size=${size}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
