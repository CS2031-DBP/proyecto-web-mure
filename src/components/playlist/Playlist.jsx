import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isPlaylistOwner } from "../../services/playlists/isOwner";
import { deleteSongFromPlaylist } from "../../services/playlists/deleteSongFromPlaylist";
import { deletePlaylist } from "../../services/playlists/deletePlaylist";
import { searchSong } from "../../services/songs/searchSong";
import Headphones from "@mui/icons-material/Headphones";

// Componente Playlist que recibe props: playlist, edit, onUpdate
const Playlist = ({ playlist, edit, onUpdate }) => {
  const [isOwner, setIsOwner] = useState(false); // Estado para manejar si el usuario actual es el dueño de la playlist
  const [error, setError] = useState(""); // Estado para manejar errores
  const [songsDetails, setSongsDetails] = useState([]); // Estado para manejar los detalles de las canciones
  const navigate = useNavigate(); // Hook de navegación para redirigir a otras páginas

  // useEffect para verificar si el usuario actual es el dueño de la playlist
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

  // useEffect para obtener los detalles de las canciones de la playlist
  useEffect(() => {
    const fetchSongsDetails = async () => {
      try {
        const details = await Promise.all(
          playlist.songsTitles.map(async (title) => {
            const res = await searchSong(title);
            return res.data;
          })
        );
        setSongsDetails(details);
      } catch (err) {
        setError("Error al buscar detalles de las canciones.");
      }
    };

    if (playlist.songsTitles && playlist.songsTitles.length > 0) {
      fetchSongsDetails();
    }
  }, [playlist.songsTitles]);

  // Función para manejar el click en el botón de editar
  const handleEditClick = () => {
    navigate(`/playlist/edit/${playlist.id}`);
  };

  // Función para manejar la eliminación de una canción de la playlist
  const handleDeleteClick = async (title) => {
    try {
      const res1 = await searchSong(title);
      const songId = res1.data.id;
      await deleteSongFromPlaylist(playlist.id, songId);
      onUpdate(); // Actualiza la playlist
    } catch (err) {
      console.error(err);
    }
  };

  // Función para manejar la eliminación de la playlist
  const handleDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlist.id);
      onUpdate(); // Actualiza la lista de playlists
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-4xl m-5">
      <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
      <p className="mb-4">Autor: {playlist.userName}</p>
      <h3 className="text-xl font-semibold mb-2">Canciones:</h3>
      {playlist.songsTitles && playlist.songsTitles.length === 0 ? (
        <p>No tienes canciones aún</p>
      ) : (
        <div>
          {songsDetails.map((song) => (
            <div key={song.id} className="flex mb-4 items-center">
              <img
                src={song.coverImage}
                alt={`${song.title} cover`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4 ml-4 flex-grow">
                <div>
                  <p className="font-bold">Título: {song.title}</p>
                  <p>Artista: {song.artistsNames.join(", ")}</p>
                </div>
                <div>
                  <p>Duración: {song.duration}</p>
                  <p>Género: {song.genre}</p>
                </div>
                <div className="col-span-2 flex justify-between items-center">
                  <a
                    href={song.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <Headphones />
                  </a>
                  {isOwner && edit && (
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(song.title)}
                      className="px-2 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isOwner && !edit && (
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
            onClick={handleEditClick}
          >
            Añadir/Quitar Canciones
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleDeletePlaylist}
          >
            Borrar Playlist
          </button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Playlist;
