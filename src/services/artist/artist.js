import Api from '../api';

const api = new Api({});


export async function checkArtistInDatabase(name, page = 0, size = 10) {
    let options = {
        url: `/artist/name?name=${name}&page=${page}&size=${size}`, 
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function createArtists(artists) {
    let options = {
        url: `/artist`,
    };

    try {
        const res = await api.post(artists, options); 

        return res;
    } catch (error) {
        throw error;
    }
}