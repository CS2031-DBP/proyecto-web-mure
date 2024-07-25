import Api from "../api";

const api = new Api({});

export async function updatePlaylist(formData) {
  let options = {
    url: "/playlist",
  };

  try {
    const res = await api.patchForm(formData, options);
    return res;
  } catch (error) {
    throw error;
  }
}
