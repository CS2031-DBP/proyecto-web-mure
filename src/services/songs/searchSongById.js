import Api from "../api";

const api = new Api({});

export async function searchSongById(id) {
  let options = {
    url: `/songs/${id}`,
  };

  try {
    const res = await api.get(options);
    return res;
  } catch (error) {
    throw error;
  }
}
