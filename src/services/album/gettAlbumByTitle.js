import Api from "../api";

const api = new Api({});

export async function getAlbumByTitle(title, page = 0, size = 10) {
  const options = {
    url: `/album/title?title=${title}&page=${page}&size=${size}`,
  };

  const res = await api.get(options); 
  return res;
}