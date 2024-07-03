import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlaylistById } from '../services/playlists/getPlaylistById';
import Playlist from '../components/playlist/Playlist';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';
import { searchSong } from '../services/songs/searchSong';
import { addSongToPlaylist } from '../services/playlists/addSongToPlaylist';

const EditPlaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songSearchTerm, setSongSearchTerm] = useState('');
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchPlaylist = async () => {
    try {
      const response = await getPlaylistById(id);
      if (response.status === 200) {
        setPlaylist(response.data);
        setFetchError('');
      } else {
        setFetchError('Failed to fetch playlist data.');
      }
    } catch (err) {
      setFetchError('Failed to fetch playlist data.');
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setError('');
    try {
      const results = await searchSong(songSearchTerm);
      if (results.status === 200) {
        setSongSearchResults([results.data]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No se han encontrado canciones con ese título :(');
        setSongSearchResults([]);
      } else {
        setError('Error al buscar canciones.');
      }
    }
  };

  const handleAdd = async (songId) => {
    try {
      await addSongToPlaylist(playlist.id, songId);
      fetchPlaylist();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('La canción ya está en la playlist');
      } else {
        setError('Error al añadir la canción a la playlist.');
      }
    }
  };

  if (fetchError) {
    return <p>{fetchError}</p>;
  }

  if (!playlist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="items-center justify-center">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Editar Playlist</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <Playlist playlist={playlist} edit={true} onUpdate={fetchPlaylist} />
        <SearchInput
          searchTerm={songSearchTerm}
          handleSearchTermChange={handleSongSearchTermChange}
          handleSearch={handleSearch}
          type="song"
        />
        <SearchResults
          results={songSearchResults}
          handleAdd={(id) => handleAdd(id)}
          type="song"
        />
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() => navigate('/profile')}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default EditPlaylist;
