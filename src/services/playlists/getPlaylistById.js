import Api from "../api";

const api = new Api({});

export async function getPlaylistById(id) {
  let options = {
    url: `/playlist/${id}`,
  };

  try {
    const res = await api.get(options);
    return res;
  } catch (error) {
    throw error;
  }
}
