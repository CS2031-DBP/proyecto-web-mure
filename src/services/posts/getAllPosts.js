import Api from "../api";

const api = new Api({});

export async function fetchPosts(page, size) {
    let options = {
        url: `/post/all?page=${page}&size=${size}`,
    };

    try {
        const res = await api.get(options);
        return res;
    } catch (error) {
        return error;
    }
}