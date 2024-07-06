import React, { useState, useEffect } from "react";
import { createSong } from "../services/songs/createSong";
import { searchArtist } from "../services/artist/getArtistByName";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpotify } from "react-icons/fa";

const AddSong = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "",
    artistsIds: [],
    releaseDate: "",
    genre: "",
    duration: "",
    coverImage: "",
  });
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [addedArtists, setAddedArtists] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const songData = localStorage.getItem('selectedSong');
    if (songData) {
      const parsedData = JSON.parse(songData);
      setData(parsedData);
      localStorage.removeItem('selectedSong');
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleArtistSearchTermChange = (e) => {
    setArtistSearchTerm(e.target.value);
  };

  const handleSearch = async (type) => {
    setError("");
    setSuccess("");

    try {
      if (type === "artist") {
        const results = await searchArtist(artistSearchTerm);
        if (results.status === 200) {
          setArtistSearchResults([results.data]);
        } else if (results.response && results.response.status === 404) {
          setError("No se han encontrado artistas con ese nombre :(");
          setArtistSearchResults([]);
        } else {
          setError("Error al buscar artistas.");
        }
      }
    } catch (error) {
      setError("Error al buscar.");
    }
  };

  const handleAdd = (id, type, artistDetails) => {
    if (type === "artist") {
      if (data.artistsIds.includes(id)) {
        setError("El artista ya está añadido.");
        return;
      }

      setData((prevData) => ({
        ...prevData,
        artistsIds: [...prevData.artistsIds, id],
      }));
      setAddedArtists((prevArtists) => [...prevArtists, artistDetails]);
      setArtistSearchResults([]);
      setArtistSearchTerm("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      title: data.title,
      artistsIds: data.artistsIds,
      releaseDate: data.releaseDate,
      genre: data.genre,
      duration: data.duration,
      coverImage: data.coverImage,
    };

    try {
      const res = await createSong(payload);
      if (res.status === 201) {
        setSuccess("Canción creada con éxito.");
        navigate("/songs");
      } else {
        setError("Error al crear la canción.");
      }
    } catch (error) {
      setError("Error al crear la canción.");
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
        <h1 className="text-3xl font-bold mb-6">Añadir Canción</h1>
        <button onClick={() => console.log(data)}>Log Data</button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Titulo
            </label>
            <motion.input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium mb-1"
            >
              Fecha de Lanzamiento
            </label>
            <motion.input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={data.releaseDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="genre" className="block text-sm font-medium mb-1">
              Genero
            </label>
            <motion.input
              type="text"
              id="genre"
              name="genre"
              value={data.genre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="duration"
              className="block text-sm font-medium mb-1"
            >
              Duración
            </label>
            <motion.input
              type="text"
              id="duration"
              name="duration"
              value={data.duration}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium mb-1"
            >
              Cover Image
            </label>
            <motion.input
              type="text"
              id="coverImage"
              name="coverImage"
              value={data.coverImage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg bg-gray-700 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <SearchInput
              searchTerm={artistSearchTerm}
              handleSearchTermChange={handleArtistSearchTermChange}
              handleSearch={handleSearch}
              type="artist"
            />
            <SearchResults
              results={artistSearchResults}
              handleAdd={handleAdd}
              type="artist"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Artistas Añadidos</h2>
            <AnimatePresence>
              {addedArtists.length === 0 ? (
                <p>No has añadido artistas aún.</p>
              ) : (
                addedArtists.map((artist, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-700 text-white p-4 mb-4 rounded-lg flex items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1">
                      <p className="font-bold">
                        {artist.name}{" "}
                        {artist.verified && (
                          <VerifiedIcon className="text-blue-500" />
                        )}
                      </p>
                      <p>Cumpleaños: {artist.birthday}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg transition duration-300"
            >
              Agregar Canción
            </button>
          </div>
        </form>
        <div className="fixed bottom-10 right-10">
          <button
            onClick={() => navigate('/song/create/spotify')}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
            title="Buscar en Spotify"
          >
            <FaSpotify className="text-2xl" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddSong;
