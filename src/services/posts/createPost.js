import Api from '../api';

const api = new Api({});

export async function createPost(formData) {
    let options = {
        url: '/post',
    };

    try {
        const res = await api.request(options);
        return res;
    } catch (error) {
        throw error;
    }
}
