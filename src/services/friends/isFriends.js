import Api from "../api";

const api = new Api({});

export async function isFriends(userId) {
  let options = {
    url: `/user/me/friends/${userId}`,
  };

  try {
    const response = await api.get(options);
    return response;
  } catch (error) {
    throw error;
  }
}
