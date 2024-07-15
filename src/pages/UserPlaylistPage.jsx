import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMyPlaylists } from '../services/playlists/getMyPlaylists';
import { getUserPlaylists } from '../services/playlists/getPlaylistsByUserId';
import PlaylistItem from '../components/playlist/PlaylistItem';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { motion } from 'framer-motion';

const UserPlaylistsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [errors, setErrors] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const currentUserResponse = await fetchCurrentUser();
        setCurrentUser(currentUserResponse.data);

        let playlistsData;
        if (!id || id === currentUserResponse.data.id) {
          playlistsData = await fetchMyPlaylists(page, size);
        } else {
          playlistsData = await getUserPlaylists(id, page, size);
        }
        console.log('Playlists Data:', playlistsData.data);
        setPlaylists(playlistsData.data.content || playlistsData.data);
      } catch (error) {
        console.error('Error loading playlists:', error);
        setErrors('Failed to load playlists');
      }
    };

    loadPlaylists();
  }, [id, page, size]);

  return (
    <div className="container mx-auto py-8">
      {errors && <p className="text-red-500">{errors}</p>}
      <h1 className="text-3xl font-bold mb-6">Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist, index) => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default UserPlaylistsPage;
