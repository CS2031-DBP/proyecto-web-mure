import Api from "../api";

const api = new Api({});

export async function isAlbumLikedByUser(albumId, userId) {
  let options = {
    url: `/album/liked/${albumId}/${userId}`,
  };

  try {
    const res = await api.get(options);
    return res;
  } catch (error) {
    throw error;
  }
}
