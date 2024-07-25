import Api from "../api";

const api = new Api({});

export async function deleteFriend(userId) {
  let options = {
    url: `/user/friends/remove/${userId}`,
  };

  try {
    const response = await api.patch({}, options);
    return response;
  } catch (error) {
    throw error;
  }
}
