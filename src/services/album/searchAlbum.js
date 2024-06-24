import Api from '../api';

const api = new Api({});

export async function searchAlbum(title) {
    let options = {
        url: `/album/title?title=${title}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        console.error('Error searching album:', error);
        throw error;
    }
}
