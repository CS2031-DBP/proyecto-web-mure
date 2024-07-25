import Api from "../api";

const api = new Api({});

export async function searchSongsByGenre(genre, page, size) {
  let options = {
    url: `/songs/genre?genre=${genre}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}
