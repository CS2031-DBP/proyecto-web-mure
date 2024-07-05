import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistById } from "../services/playlists/getPlaylistById";
import Playlist from "../components/playlist/Playlist";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { searchSong } from "../services/songs/searchSong";
import { addSongToPlaylist } from "../services/playlists/addSongToPlaylist";
import { motion, AnimatePresence } from 'framer-motion';

const EditPlaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la playlist desde los parámetros de la URL
  const [playlist, setPlaylist] = useState(null); // Estado para almacenar la información de la playlist
  const [songSearchTerm, setSongSearchTerm] = useState(""); // Estado para el término de búsqueda de canciones
  const [songSearchResults, setSongSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda de canciones
  const [error, setError] = useState(""); // Estado para manejar errores
  const [fetchError, setFetchError] = useState(""); // Estado para manejar errores de fetch

  // Función para obtener los datos de la playlist por ID
  const fetchPlaylist = async () => {
    try {
      const response = await getPlaylistById(id);
      if (response.status === 200) {
        setPlaylist(response.data);
        setFetchError("");
      } else {
        setFetchError("Failed to fetch playlist data.");
      }
    } catch (err) {
      setFetchError("Failed to fetch playlist data.");
    }
  };

  // useEffect para obtener los datos de la playlist cuando el componente se monta o cambia el ID
  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  // Maneja los cambios en el término de búsqueda de canciones
  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
  };

  // Maneja la búsqueda de canciones
  const handleSearch = async () => {
    setError("");
    try {
      const results = await searchSong(songSearchTerm);
      if (results.status === 200) {
        setSongSearchResults([results.data]);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No se han encontrado canciones con ese título :(");
        setSongSearchResults([]);
      } else {
        setError("Error al buscar canciones.");
      }
    }
  };

  // Maneja la adición de una canción a la playlist
  const handleAdd = async (songId) => {
    try {
      await addSongToPlaylist(playlist.id, songId);
      fetchPlaylist(); // Actualiza la playlist después de añadir la canción
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("La canción ya está en la playlist");
      } else {
        setError("Error al añadir la canción a la playlist.");
      }
    }
  };

  // Muestra un mensaje de error si ocurre un error al obtener la playlist
  if (fetchError) {
    return <p>{fetchError}</p>;
  }

  // Muestra un mensaje de carga mientras se obtienen los datos de la playlist
  if (!playlist) {
    return <p>Loading...</p>;
  }

  return (
    <motion.div
      className="items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg transition duration-300"
          onClick={() => navigate("/profile")}
        >
          Guardar Cambios
        </button>
      </div>
    </motion.div>
  );
};

export default EditPlaylist;
