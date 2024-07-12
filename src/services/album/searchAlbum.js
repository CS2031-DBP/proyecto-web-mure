import Api from "../api";

const api = new Api({});

export async function searchAlbum(title, page = 0, size = 10) {
    const options = {
        url: `/album/title?title=${title}&page=${page}&size=${size}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function searchAlbumById(id) {
    const options = {
        url: `/album/${id}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}