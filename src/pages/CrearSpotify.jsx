import React, { useState } from 'react';
import { getToken, searchTracks, getArtistDetailsFromSpotify } from '../services/spotify/spotify';
import { checkArtistInDatabase, createArtists } from '../services/artist/artist';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CreateSpotify = () => {
  const [title, setTitle] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = await getToken();
      const results = await searchTracks(title, token);
      setTracks(results);
    } catch (error) {
      setError('Error al buscar en Spotify.');
    }
  };

  const handleSelect = async (track) => {
    const artists = track.artists.map(artist => artist.name);
    const artistIds = [];
    const missingArtists = [];

    for (const artistName of artists) {
      const response = await checkArtistInDatabase(artistName);
      if (response && response.data) {
        artistIds.push(response.data.id);
      } else {
        missingArtists.push(artistName);
      }
    }

    if (missingArtists.length > 0) {
      localStorage.setItem('missingArtists', JSON.stringify(missingArtists));
      localStorage.setItem('selectedTrack', JSON.stringify(track));
      navigate('/add-artist-info');
      return;
    }

    const songData = {
      title: track.name,
      artistsIds: artistIds,
      releaseDate: track.album.release_date,
      genre: '',
      duration: `${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`,
      coverImage: track.album.images[0].url,
      link: track.external_urls.spotify,
    };
    localStorage.setItem('selectedSong', JSON.stringify(songData));
    navigate('/addsong');
  };

  return (
    <motion.div
      className="items-center justify-center p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-gradient1 via-prueba to-gradient3 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Buscar Canción en Spotify</h1>
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-crema5 text-black mb-4"
            placeholder="Título de la canción"
          />
          <button
            onClick={handleSearch}
            className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg transition duration-300"
          >
            Buscar
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          {tracks.map((track) => (
            <motion.div 
              key={track.id} 
              className="bg-crema5 text-black p-4 mb-4 rounded-lg flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={track.album.images[0].url} alt={`${track.name} cover`} className="w-16 h-16 object-cover rounded-lg" />
              <div className="ml-4 flex-1">
                <p className="font-bold">{track.name}</p>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                <button
                  onClick={() => handleSelect(track)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 mt-2"
                >
                  Seleccionar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateSpotify;
