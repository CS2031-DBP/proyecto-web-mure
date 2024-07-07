import React, { useState, useEffect } from 'react';
import { createArtists, checkArtistInDatabase } from '../services/artist/artist';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AddArtistInfo = () => {
  const [artists, setArtists] = useState([]);
  const [artistDetails, setArtistDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const missingArtists = JSON.parse(localStorage.getItem('missingArtists'));
    if (missingArtists) {
      setArtists(missingArtists);
      setArtistDetails(missingArtists.map(artist => ({ name: artist, description: '', birthDate: '', verified: false })));
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...artistDetails];
    updatedDetails[index][field] = value;
    setArtistDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArtists(artistDetails);
      const track = JSON.parse(localStorage.getItem('selectedTrack'));
      const newArtistIds = await Promise.all(
        artistDetails.map(async artist => {
          const response = await checkArtistInDatabase(artist.name);
          return response.data.id;
        })
      );
      const songData = {
        title: track.name,
        artistsIds: newArtistIds,
        releaseDate: track.album.release_date,
        genre: '',
        duration: `${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`,
        coverImage: track.album.images[0].url,
        link: track.external_urls.spotify,
      };
      localStorage.setItem('selectedSong', JSON.stringify(songData));
      navigate('/addsong');
    } catch (error) {
      console.error("Error al crear artistas:", error);
    }
  };

  return (
    <motion.div
      className="items-center justify-center p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-gradient1 via-prueba to-gradient3 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Agregar Información de Artistas</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {artistDetails.map((artist, index) => (
            <div key={index} className="bg-crema5 text-black p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-2">{artist.name}</h2>
              <div className="mb-4">
                <label className="block mb-2">Fecha de Nacimiento:</label>
                <input
                  type="date"
                  value={artist.birthDate}
                  onChange={(e) => handleChange(index, 'birthDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-crema3"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Descripción:</label>
                <textarea
                  value={artist.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-crema3"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Verificado:</label>
                <input
                  type="checkbox"
                  checked={artist.verified}
                  onChange={(e) => handleChange(index, 'verified', e.target.checked)}
                  className="w-4 h-4 text-crema3"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg transition duration-300"
          >
            Guardar Artistas y Continuar
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddArtistInfo;
