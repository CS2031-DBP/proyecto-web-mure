import React, { useState } from 'react';
import { getToken, searchTracks } from '../services/spotify/spotify';
import { checkArtistInDatabase } from '../services/artist/artist';
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
      setError('Error searching on Spotify.');
    }
  };

  const handleSelect = async (track) => {
    const artists = track.artists.map(artist => artist.name);
    const artistIds = [];
    const missingArtists = [];

    for (const artistName of artists) {
      const response = await checkArtistInDatabase(artistName, 0, 1);
      if (response && response.data.content.length > 0) {
        artistIds.push(response.data.content[0].id);
      } else {
        missingArtists.push({
          name: artistName,
          imageUrl: track.album.images[0]?.url || '', // Add imageUrl for missing artists
        });
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
      coverImage: track.album.images[0]?.url || '',
      link: track.external_urls.spotify,
    };
    localStorage.setItem('selectedSong', JSON.stringify(songData));
    navigate('/addsong');
  };

  return (
    <motion.div
      className="items-center justify-center p-8 flex"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black text-white rounded-lg shadow-lg p-4 aspect-w-1 aspect-h-1">
        <h1 className="text-3xl font-mono mb-6 text-white">Search on Spotify</h1>
        <div className="p-4 flex justify-center items-center"></div>
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Song title"
          />
          <button
            onClick={handleSearch}
            className="w-full py-2 mt-4 text-white rounded-full transition duration-300 bg-color4 hover:bg-color3"
          >
            Search
          </button>
          <button
            className="w-full py-2 mt-4 text-white rounded-full transition duration-300 bg-color4 hover:bg-color3"
            onClick={() => navigate('/AddSong')}
          >
            Back
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          {tracks.map((track) => (
            <div key={track.id} className="bg-spotify-gray p-4 mb-4 rounded-sm flex items-center border border-transparent hover:border-white transition duration-100">
              <img src={track.album.images[0]?.url || ''} alt={`${track.name} cover`} className="w-16 h-16 object-cover rounded-lg" />
              <div className="ml-4 flex-1">
                <p className="font-bold">{track.name}</p>
                <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                <button
                  onClick={() => handleSelect(track)}
                  className="rounded-full bg-color1 hover:bg-color2 text-white px-4 py-2 transition duration-300 mt-2"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateSpotify;
