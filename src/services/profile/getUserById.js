import Api from "../api";

const api = new Api({});

export async function getUserById(id) {
  let options = {
    url: `/user/${id}`,
  };

  try {
    const res = await api.get(options);
    return res;
  } catch (error) {
    throw error;
  }
}
