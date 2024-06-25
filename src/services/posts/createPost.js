import Api from "../api";

const api = new Api({});

export async function createPost(post) {
    let options = {
        url: "/post",
    };

    try {
        const res = await api.post(post, options);
        return res;
    } catch (error) {
        throw error;
    }
}