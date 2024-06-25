import Api from '../api';

const api = new Api({});

export async function getPostsByUser(userId) {
    let options = {
        url: `/post/user/${userId}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        throw error;
    }
}
