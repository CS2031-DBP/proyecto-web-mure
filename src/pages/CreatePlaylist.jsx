import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSong } from "../services/songs/searchSong";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { useNavigate } from "react-router-dom";
import Headphones from "@mui/icons-material/Headphones";
import { createPlaylist } from "../services/playlists/createPlayllist";
import { motion, AnimatePresence } from 'framer-motion';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userId: "",
    name: "",
    songsIds: [],
  });
  const [songsDetails, setSongsDetails] = useState([]); // Estado para almacenar los detalles de las canciones añadidas
  const [songSearchTerm, setSongSearchTerm] = useState(""); // Estado para el término de búsqueda de canciones
  const [songSearchResults, setSongSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda de canciones
  const [error, setError] = useState(""); // Estado para manejar errores
  const [success, setSuccess] = useState(""); // Estado para manejar el mensaje de éxito

  // Maneja los cambios en los campos del formulario y actualiza el estado
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Maneja los cambios en el término de búsqueda de canciones
  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
  };

  // Maneja la búsqueda de canciones
  const handleSearch = async () => {
    setError("");
    setSuccess("");

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
  const handleAdd = (id, type, songDetails) => {
    if (type === "song") {
      if (data.songsIds.includes(id)) {
        setError("La canción ya está añadida a la playlist.");
        return;
      }

      setData((prevData) => ({
        ...prevData,
        songsIds: [...prevData.songsIds, id],
      }));
      setSongsDetails((prevDetails) => [...prevDetails, songDetails]);
      setSongSearchResults([]);
      setSongSearchTerm("");
    }
  };

  // Maneja la eliminación de una canción de la playlist
  const handleRemoveSong = (id) => {
    setData((prevData) => ({
      ...prevData,
      songsIds: prevData.songsIds.filter((songId) => songId !== id),
    }));
    setSongsDetails((prevDetails) =>
      prevDetails.filter((song) => song.id !== id)
    );
  };

  // Efecto para obtener el ID del usuario actual al montar el componente
  useEffect(() => {
    const getId = async () => {
      try {
        const id = await fetchCurrentUser();
        setData((prevData) => ({ ...prevData, userId: id.data.id }));
      } catch (error) {
        console.error("Error getting id:", error);
      }
    };
    getId();
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = [
      {
        userId: data.userId,
        name: data.name,
        songsIds: data.songsIds,
      },
    ];

    try {
      const res = await createPlaylist(payload);
      if (res.status === 201) {
        setSuccess("Playlist creada con éxito.");
        navigate("/profile");
      } else {
        setError("Error al crear la playlist.");
      }
    } catch (error) {
      setError("Error al crear la playlist.");
    }
  };

  return (
    <motion.div
      className="items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Create Playlist</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre de la Playlist:
            </label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="col-span-1 flex flex-col">
            <SearchInput
              searchTerm={songSearchTerm}
              handleSearchTermChange={handleSongSearchTermChange}
              handleSearch={handleSearch}
              type="song"
            />
            <SearchResults
              results={songSearchResults}
              handleAdd={(id, type) =>
                handleAdd(
                  id,
                  type,
                  songSearchResults.find((song) => song.id === id)
                )
              }
              type="song"
            />
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            {songsDetails.length > 0 ? (
              <div className="bg-gray-700 text-white p-4 rounded-lg flex flex-col justify-between h-full">
                <AnimatePresence>
                  {songsDetails.map((song) => (
                    <motion.div
                      key={song.id}
                      className="flex mb-4"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={song.coverImage}
                        alt={`${song.title} cover`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4 ml-4">
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
                          <button
                            type="button"
                            onClick={() => handleRemoveSong(song.id)}
                            className="ml-4 px-2 py-1 bg-red-600 text-white rounded-lg transition duration-300"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p>No has añadido canciones aún.</p>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg transition duration-300"
            >
              Crear Playlist
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePlaylist;
