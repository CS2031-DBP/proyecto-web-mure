import Api from '../api';

const api = new Api({});

export async function searchSongsByTitle(title, page = 0, size = 10) {
    let options = {
        url: `/songs/title?title=${title}&page=${page}&size=${size}`
    };
    
    try {
        const res = await api.get(options);
        return res; 
    } catch (error) {
        throw error; 
    }
}

export async function searchSongsByGenre(genre, page = 0, size = 10) {
    let options = {
        url: `/songs/genre?genre=${genre}&page=${page}&size=${size}`
    };
    
    try {
        const res = await api.get(options);
        return res; 
    } catch (error) {
        throw error; 
    }
}

export async function searchSongsByArtistName(artistName, page = 0, size = 10) {
    let options = {
        url: `/songs/artistName?artistName=${artistName}&page=${page}&size=${size}`
    };
    
    try {
        const res = await api.get(options);
        return res; 
    } catch (error) {
        throw error; 
    }
}
