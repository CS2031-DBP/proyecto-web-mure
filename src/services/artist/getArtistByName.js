import Api from "../api";

const api = new Api({});

export async function searchArtist(name) {
    let options = {
        url: `/artist/name?name=${name}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}