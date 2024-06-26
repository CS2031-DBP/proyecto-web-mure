import Api from "../api";

const api = new Api({})

export async function fetchMyPlaylists() {
    let options = {
        url: "/playlist/me",
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}