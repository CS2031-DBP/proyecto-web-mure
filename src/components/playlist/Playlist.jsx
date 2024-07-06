import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isPlaylistOwner } from "../../services/playlists/isOwner";
import { deleteSongFromPlaylist } from "../../services/playlists/deleteSongFromPlaylist";
import { deletePlaylist } from "../../services/playlists/deletePlaylist";
import { searchSongById } from "../../services/songs/searchSongById";
import { motion } from "framer-motion";
import { FaHeadphones, FaTrashAlt, FaPlus } from "react-icons/fa";

const Playlist = ({ playlist, edit, onUpdate }) => {
  const [isOwner, setIsOwner] = useState(false);
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

  const handleEditClick = () => {
    navigate(`/playlist/edit/${playlist.id}`);
  };

  const handleDeleteClick = async (title) => {
    try {
      const res1 = await searchSongsByTitle(title);
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

  return (
    <motion.div
      className="bg-gradient-to-r from-custom-purple-1 via-custom-purple-2 to-custom-purple-3 text-white p-6 rounded-lg shadow-md w-full max-w-screen-md mx-auto mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
      <p className="mb-4">Autor: {playlist.userName}</p>
      <h3 className="text-xl font-semibold mb-2">Canciones:</h3>
      {playlist.songsTitles && playlist.songsTitles.length === 0 ? (
        <p>No tienes canciones aún</p>
      ) : (
        <div>
          {songsDetails.map((song) => (
            <div key={song.id} className="mb-4 p-4 rounded-md bg-white text-black shadow-md">
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
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(song.title)}
                    className="ml-4 px-2 py-1 bg-red-500 text-white rounded-md transition duration-300 hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {isOwner && !edit && (
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md transition duration-300 hover:bg-yellow-600 flex items-center"
            onClick={handleEditClick}
          >
            <FaPlus className="mr-2" />
            Añadir/Quitar Canciones
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md transition duration-300 hover:bg-red-600 flex items-center"
            onClick={handleDeletePlaylist}
          >
            <FaTrashAlt className="mr-2" />
            Borrar Playlist
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </motion.div>
  );
};

export default Playlist;
