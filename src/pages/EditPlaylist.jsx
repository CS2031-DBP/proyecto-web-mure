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
    <div>
      <h1>Editar PlayList</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
      <button onClick={() => navigate('/profile')}>Guardar Cambios</button>
    </div>
  );
};

export default EditPlaylist;
