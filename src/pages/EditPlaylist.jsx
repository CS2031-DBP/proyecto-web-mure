import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistById } from "../services/playlists/getPlaylistById";
import Playlist from "../components/playlist/Playlist";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { searchSongsByTitle } from "../services/songs/searchSongBy";
import { addSongToPlaylist } from "../services/playlists/addSongToPlaylist";
import { motion } from 'framer-motion';

const EditPlaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songSearchTerm, setSongSearchTerm] = useState("");
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const fetchPlaylist = async () => {
    try {
      const response = await getPlaylistById(id);
      if (response.status === 200) {
        setPlaylist(response.data);
        setFetchError("");
      } 
    } catch (err) {
      console.error(err);
      setFetchError("Failed to fetch playlist data.");
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    setError("");
    try {
      const results = await searchSongsByTitle(songSearchTerm, page, size);
      if (results.status === 200) {
        setSongSearchResults(results.data.content);
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

  const handleAdd = async (songId) => {
    try {
      await addSongToPlaylist(playlist.id, songId);
      fetchPlaylist();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("La canción ya está en la playlist");
      } else {
        setError("Error al añadir la canción a la playlist.");
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
    <motion.div
      className="items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-gradient1 via-prueba to-gradient3 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
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
