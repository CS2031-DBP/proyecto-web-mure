import Api from "../api";

const api = new Api({});

export async function createPlaylist(formData) {
  let options = {
    url: "/playlist/image",
  };

  try {
    const res = await api.postForm(formData, options);
    return res;
  } catch (error) {
    throw error;
  }
}
