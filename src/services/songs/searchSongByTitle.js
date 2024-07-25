import Api from "../api";
//todo
const api = new Api({});

export async function searchSongsByTitle(title, page, size) {
  let options = {
    url: `/songs/title?title=${title}&page=${page}&size=${size}`,
  };

  const res = await api.get(options);
  return res;
}