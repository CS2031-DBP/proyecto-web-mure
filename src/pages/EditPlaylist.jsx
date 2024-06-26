import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlaylistById } from '../services/playlists/getPlaylistById';
import Playlist from '../components/playlist/Playlist';

const EditPlaylist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await getPlaylistById(id);
        if (response.status === 200) {
          setPlaylist(response.data);
        } else {
          setError('Failed to fetch playlist data.');
        }
      } catch (err) {
        setError('Failed to fetch playlist data.');
      }
    };

    fetchPlaylist();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!playlist) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Playlist</h1>
      <Playlist playlist={playlist} />
      {/* Aquí puedes agregar formularios o componentes adicionales para editar la playlist */}
    </div>
  );
};

export default EditPlaylist;
