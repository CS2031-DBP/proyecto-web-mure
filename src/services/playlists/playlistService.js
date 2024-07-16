import Api from '../api';

const api = new Api({});

export async function updatePlaylist(formData) {
  let options = {
    url: '/playlist'
  };

  try {
    const res = await api.patchForm(formData, options);
    return res;
  } catch (error) {
    throw error;
  }
}

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

export async function removeSongFromPlaylist(playlistId, songId) {
  let options = {
    url: `/playlist/${playlistId}/removeSong/${songId}`
  };

  try {
    const res = await api.patch({}, options);
    return res;
  } catch (error) {
    throw error;
  }
}
