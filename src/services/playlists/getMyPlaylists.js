import Api from "../api";

const api = new Api({})
 
export async function fetchMyPlaylists(page = 0, size = 10) {
    let options = {
        url: `/playlist/me?page=${page}&size=${size}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}