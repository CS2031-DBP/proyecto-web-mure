import Api from "../api";

const api = new Api({})

export async function dislikePost(postId) {
    let options = {
        url: `/post/dislike/${postId}`,
    };

    try {   
        const res = await api.patch({}, options);
        return res;
    } catch (error) {
        throw error;
    }
}