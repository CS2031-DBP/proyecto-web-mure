import Api from "../api";

const api = new Api({});

export async function searchSongsByArtistName(artistName, page, size) {
  let options = {
    url: `/songs/artistName?artistName=${artistName}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}
