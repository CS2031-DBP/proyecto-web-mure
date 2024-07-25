import Api from "../api";

const api = new Api({});

export async function addSongToPlaylist(playlistId, songId) {
  let options = {
    url: `/playlist/${playlistId}/addSong/${songId}`
  };

  try {
    const res = await api.patch({}, options);
    return res;
  } catch (error) {
    throw error;
  }
}
