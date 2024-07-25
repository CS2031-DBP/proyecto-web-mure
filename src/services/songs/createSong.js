import Api from "../api";

const api = new Api({});

export async function createSong(songs) {
  let options = {
    url: "/songs",
  };

  try {
    const res = await api.post(songs, options);
    return res;
  } catch (error) {
    throw error;
  }
}
