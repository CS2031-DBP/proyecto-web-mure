import Api from "../api";

const api = new Api({});

export async function addFriend(userId) {
  let options = {
    url: `/user/friends/add/${userId}`,
  };

  try {
    const response = await api.patch({}, options);
    return response;
  } catch (error) {
    throw error;
  }
}
