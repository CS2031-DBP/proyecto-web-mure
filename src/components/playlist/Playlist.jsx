import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isPlaylistOwner } from "../../services/playlists/isOwner";
import { deleteSongFromPlaylist } from "../../services/playlists/deleteSongFromPlaylist";
import { deletePlaylist } from "../../services/playlists/deletePlaylist";
import { searchSongById } from "../../services/songs/searchSongById";
import { motion } from "framer-motion";
import { FaHeadphones } from "react-icons/fa";
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import Delete from '@mui/icons-material/Delete';
import { getUserById } from "../../services/profile/getUserById";

const Playlist = ({ playlist, edit, onUpdate }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState("");
  const [songsDetails, setSongsDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const response = await isPlaylistOwner(playlist.id);
        if (response.status === 200) {
          setIsOwner(response.data);
        } else {
          setError("Error al verificar la propiedad de la playlist.");
        }
      } catch (err) {
        setError("Error al verificar la propiedad de la playlist.");
      }
    };
    checkOwnership();
  }, [playlist.id]);

  useEffect(() => {
    const fetchSongsDetails = async () => {
      try {
        const details = await Promise.all(
          playlist.songsIds.map(async (id) => {
            const res = await searchSongById(id);
            return res.data;
          })
        );
        setSongsDetails(details);
      } catch (err) {
        setError("Error al buscar detalles de las canciones.");
      }
    };

    if (playlist.songsIds && playlist.songsIds.length > 0) {
      fetchSongsDetails();
    }
  }, [playlist.songsIds]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getUserById(playlist.userId);
        setUsername(user.data.name);
      } catch (err) {
        setError("Error al buscar el nombre del usuario.");
      }
    };

    fetchUsername();
  }, [playlist.userId]);

  const handleEditClick = () => {
    navigate(`/playlist/edit/${playlist.id}`);
  };

  const handleDeleteClick = async (title) => {
    try {
      const res1 = await searchSongById(title);
      const songId = res1.data.id;
      await deleteSongFromPlaylist(playlist.id, songId);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlist.id);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.5 } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-custom-purple-1 via-custom-purple-2 to-custom-purple-3 text-white p-6 rounded-lg shadow-md w-full max-w-screen-md mx-auto mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-start">
        <div className="mr-4">
          <h2 className="text-2xl font-bold mb-2 text-left">Nombre: {playlist.name}</h2>
          <p className="mb-2 text-left">Autor: {username}</p>
        </div>
        {isOwner && !edit && (
          <div className="flex flex-col space-y-2">
            <motion.button
              className="p-2 bg-green-500 text-white rounded-md transition duration-300 flex items-center"
              onClick={handleEditClick}
              title="Añadir/Quitar Canciones"
              variants={buttonVariants}
              whileHover="hover"
            >
              <PlaylistAdd />
            </motion.button>
            <motion.button
              className="p-2 bg-red-500 text-white rounded-md transition duration-300 flex items-center"
              onClick={handleDeletePlaylist}
              title="Borrar Playlist"
              variants={buttonVariants}
              whileHover="hover"
            >
              <Delete />
            </motion.button>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">Canciones:</h3>
      {playlist.songsTitles && playlist.songsTitles.length === 0 ? (
        <p>No tienes canciones aún</p>
      ) : (
        <div>
          {songsDetails.map((song) => (
            <motion.div 
              key={song.id} 
              className="mb-4 p-4 rounded-md bg-white text-black shadow-md"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center">
                <img
                  src={song.coverImage}
                  alt={`${song.title} cover`}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <p className="font-bold">{song.title}</p>
                  <p>{song.artistsNames.join(", ")}</p>
                  <p>{song.duration}</p>
                  <p>{song.genre}</p>
                </div>
                <a
                  href={song.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-4"
                >
                  <FaHeadphones />
                </a>
                {isOwner && edit && (
                  <motion.button
                    type="button"
                    onClick={() => handleDeleteClick(song.id)}
                    className="ml-4 px-2 py-1 bg-red-500 text-white rounded-md transition duration-300 hover:bg-red-600"
                    variants={buttonVariants}
                    whileHover="hover"
                  >
                    Eliminar
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </motion.div>
  );
};

export default Playlist;
