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

export async function isAlbumLikedByUser(albumId, userId) {
    let options = {
        url: `/album/liked/${albumId}/${userId}`
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}

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
