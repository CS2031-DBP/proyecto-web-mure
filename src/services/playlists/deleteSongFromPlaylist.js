import Api from "../api";

const api = new Api({});

export async function deleteSongFromPlaylist(playlistId, songId) {
    let options = {
        url: `/playlist/${playlistId}/removeSong/${songId}`,
    };

    try {
        const res = await api.patch({},options);
        return res;
    } catch (error) {
        throw error;
    }

}
    