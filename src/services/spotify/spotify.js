import axios from "axios";

const clientId = 'eedbe20cd6234f6cba3a6364d1b527a7';
const clientSecret = '41b7f5ce89524a03bb41f099afc21224';

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

export async function getArtistDetailsFromSpotify(artistName) {
  const token = await getToken();
  const res = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  const artist = res.data.artists.items[0];
  return {
      name: artist.name,
      birthDate: '1990-01-01', 
      verified: artist.popularity > 50 
  };
}