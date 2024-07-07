import Api from '../api';

const api = new Api({}); 

export async function getPostsByUser(userId, page = 0, size = 10) {
    let options = {
        url: `/post/user/${userId}?page=${page}&size=${size}`,
    };

    try {
        const res = await api.get(options);
        return res.data;
    } catch (error) {
        throw error;
    }
}
