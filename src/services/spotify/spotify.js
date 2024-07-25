import axios from "axios";
//todo
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const getToken = async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    params: {
      grant_type: 'client_credentials',
    },
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
};

export async function searchTracks(query, token) {
  const res = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  return res.data.tracks.items;
}

export async function getTrackDetails(trackId) {
  const token = await getToken();
  const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}
