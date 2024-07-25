import Api from "../api";

const api = new Api({});

export async function deletePlaylist(playlistId) {
  let options = {
    url: `/playlist/${playlistId}`,
  };

  try {
    const response = await api.delete(options);
    return response;
  } catch (error) {
    throw error;
  }
}
