import Api from "../api";

const api = new Api({})

export async function likePost(postId) {
    let options = {
        url: `/post/like/${postId}`,
    };

    try {   
        const res = await api.patch(options);
        return res;
    } catch (error) {
        throw error;
    }
}