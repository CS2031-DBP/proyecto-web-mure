import Api from "../api";

const api = new Api({});

export async function searchSongsByTitle(title, page, size) {
  let options = {
    url: `/songs/title?title=${title}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}

export async function searchSongsByGenre(genre, page, size) {
  let options = {
    url: `/songs/genre?genre=${genre}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}

export async function searchSongsByArtistName(artistName, page, size) {
  let options = {
    url: `/songs/artistName?artistName=${artistName}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}
