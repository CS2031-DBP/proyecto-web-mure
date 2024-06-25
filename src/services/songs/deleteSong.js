import Api from '../api';

const api = new Api({});

export async function deleteSong(id) {
    let options = {
        url: `/songs/${id}`
    };
    
    try {
        const res = await api.delete(options); 
        return res; 
    } catch (error) {
        throw error; 
    }
};
