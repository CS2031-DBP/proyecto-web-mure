import Api from "../api";

const api = new Api({});

export async function createArtists(artists) {
  let options = {
    url: `/artist`,
  };

  try {
    const res = await api.post(artists, options);

    return res;
  } catch (error) {
    throw error;
  }
}
