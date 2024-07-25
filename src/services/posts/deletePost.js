import Api from "../api";

const api = new Api({});

export async function deletePost(postId) {
  let options = {
    url: `/post/${postId}`,
  };

  try {
    const res = await api.delete(options);
    return res;
  } catch (error) {
    throw error;
  }
}
