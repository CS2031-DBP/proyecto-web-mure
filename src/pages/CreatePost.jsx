import React, { useEffect, useState } from "react";
import { createPost } from "../services/posts/createPost";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSongById } from "../services/songs/searchSongById";
import { searchSong } from "../services/songs/searchSong";
import { searchAlbum } from "../services/album/searchAlbum";
import { useNavigate, useLocation } from "react-router-dom";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { motion } from 'framer-motion';
import ImageIcon from '@mui/icons-material/Image';
import Cancel from "@mui/icons-material/Cancel";
import PlaylistAddCircle from  "@mui/icons-material/PlaylistAddCircle"

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSongId = location.state?.songId || ""; // Obtiene el ID de la canción inicial de la ubicación

  // Estado inicial para los datos del post
  const [data, setData] = useState({
    userId: "",
    songId: initialSongId,
    albumId: "",
    description: "",
    imageUrl: "",
    audioUrl: "",
  });
  const [selectedItem, setSelectedItem] = useState(null); // Estado para el elemento seleccionado (canción o álbum)
  const [error, setError] = useState(""); // Estado para manejar errores
  const [success, setSuccess] = useState(""); // Estado para manejar el mensaje de éxito
  const [songSearchTerm, setSongSearchTerm] = useState(""); // Estado para el término de búsqueda de canciones
  const [albumSearchTerm, setAlbumSearchTerm] = useState(""); // Estado para el término de búsqueda de álbumes
  const [songSearchResults, setSongSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda de canciones
  const [albumSearchResults, setAlbumSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda de álbumes
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // Estado para la URL de la vista previa de la imagen

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

    const fetchSongDetails = async (songId) => {
      try {
        const result = await searchSongById(songId);
        if (result.status === 200) {
          setSelectedItem({ ...result.data, type: "song" });
        }
      } catch (error) {
        console.error("Error fetching song details:", error);
      }
    };

    getId();
    if (initialSongId) {
      fetchSongDetails(initialSongId);
    }
  }, [initialSongId]);

  // Efecto para obtener los detalles de la canción o álbum seleccionado
  useEffect(() => {
    if (data.songId) {
      fetchSongDetails(data.songId);
    } else if (data.albumId) {
      fetchAlbumDetails(data.albumId);
    }
  }, [data.songId, data.albumId]);

  // Función para obtener los detalles de la canción por ID
  const fetchSongDetails = async (songId) => {
    try {
      const result = await searchSongById(songId);
      if (result.status === 200) {
        setSelectedItem({ ...result.data, type: "song" });
      }
    } catch (error) {
      console.error("Error fetching song details:", error);
    }
  };

  // Función para obtener los detalles del álbum por ID
  const fetchAlbumDetails = async (albumId) => {
    try {
      const result = await searchAlbum(albumId);
      if (result.status === 200) {
        setSelectedItem({ ...result.data, type: "album" });
      }
    } catch (error) {
      console.error("Error fetching album details:", error);
    }
  };

  // Maneja los cambios en los campos del formulario y actualiza el estado
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setData({ ...data, imageUrl: files[0] });
      setImagePreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  // Maneja los cambios en el término de búsqueda de canciones y resetea la búsqueda de álbumes
  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
    if (e.target.value) {
      setAlbumSearchTerm("");
      setAlbumSearchResults([]);
      setData((prevData) => ({ ...prevData, albumId: "" }));
    }
  };

  // Maneja los cambios en el término de búsqueda de álbumes y resetea la búsqueda de canciones
  const handleAlbumSearchTermChange = (e) => {
    setAlbumSearchTerm(e.target.value);
    if (e.target.value) {
      setSongSearchTerm("");
      setSongSearchResults([]);
      setData((prevData) => ({ ...prevData, songId: "" }));
    }
  };

  // Maneja la búsqueda de canciones o álbumes
  const handleSearch = async (type) => {
    setError("");
    setSuccess("");

    try {
      if (type === "song") {
        const results = await searchSong(songSearchTerm);
        if (results.status === 200) {
          setSongSearchResults([results.data]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No se han encontrado canciones con ese título :(");
        setSongSearchResults([]);
      } else {
        setError("Error al buscar canciones.");
      }
    }

    try {
      if (type === "album") {
        const results = await searchAlbum(albumSearchTerm);
        if (results.status === 200) {
          setAlbumSearchResults([results.data]);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No se han encontrado álbumes con ese título :(");
        setAlbumSearchResults([]);
      } else {
        setError("Error al buscar álbumes.");
      }
    }
  };

  // Maneja la adición de una canción o álbum al post
  const handleAdd = (id, type, item) => {
    if (type === "song") {
      setData((prevData) => ({ ...prevData, songId: id }));
    } else {
      setData((prevData) => ({ ...prevData, albumId: id }));
    }
    setSelectedItem({ ...item, type });
    setSongSearchResults([]);
    setAlbumSearchResults([]);
    setSongSearchTerm("");
    setAlbumSearchTerm("");
  };

  // Maneja la limpieza de la selección de canción o álbum
  const handleClearSelection = () => {
    setData((prevData) => ({ ...prevData, songId: "", albumId: "" }));
    setSelectedItem(null);
  };

  // Maneja la limpieza de la imagen seleccionada
  const handleClearImage = () => {
    setData((prevData) => ({ ...prevData, imageUrl: "" }));
    setImagePreviewUrl("");
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const updateData = {};
    for (let key in data) {
      if (data[key]) {
        updateData[key] = data[key];
      }
    }

    const dataUp = [updateData];

    try {
      const res = await createPost(dataUp);
      if (res.status === 201) {
        setSuccess("Post creado con éxito.");
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Error al crear el post.");
      console.error("Error creating post:", error);
    }
  };

  return (
    <motion.div
      className="items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >

      <div className=" bg-gradient-to-r from-gradient1 via-prueba to-gradient3 text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1">
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="En que estas pensando..."
              className="w-full h-32 px-3 py-2 border rounded-lg bg-crema5 text-black"
            />
            <div className="mt-4 bg-crema5 border rounded-lg px-3 py-2">
              <div className="grid grid-cols-2 items-center">
                <label className="block text-sm font-medium mb-1 text-black text-left">
                  Ingresar Imagen
                </label>
                {imagePreviewUrl && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-red-500 justify-self-end"
                  >
                    <Cancel />
                  </button>
                )}
              </div>
              <div className="relative flex items-center border rounded-lg w-full h-40">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <label className="flex items-center justify-center w-full h-full cursor-pointer">
                    <ImageIcon className="text-gray-500 w-16 h-16" />
                    <input
                      type="file"
                      name="image"
                      accept=".png,.jpg"
                      onChange={handleChange}
                      className="absolute border inset-0 w-full h-full opacity-0 cursor-pointer "
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-between">
            {selectedItem ? (
              <div className="flex-grow bg-crema5 text-white p-4 rounded-lg flex flex-col justify-between h-full">
                <div className="flex-grow text-black">
                  {selectedItem.type === "song" && (
                    <>
                      <img
                        src={selectedItem.coverImage}
                        alt={`${selectedItem.title} cover`}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <p className="font-bold text-lg">
                        Título: {selectedItem.title}
                      </p>
                      <p>Artista: {selectedItem.artistsNames.join(", ")}</p>
                      <p>Álbum: {selectedItem.albumTitle}</p>
                      <p>Duración: {selectedItem.duration}</p>
                      <p>Género: {selectedItem.genre}</p>
                      <a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Escuchar en Spotify
                      </a>
                    </>
                  )}
                  {selectedItem.type === "album" && (
                    <>
                      <p className="font-bold text-lg">
                        Album: {selectedItem.title}
                      </p>
                      <img
                        src={selectedItem.coverImage}
                        alt={`${selectedItem.title} cover`}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <p>Artista: {selectedItem.artistName}</p>
                      <p>Número de Canciones: {selectedItem.songsCount}</p>
                      <p>Duración Total: {selectedItem.totalDuration}</p>
                      <p>Canciones: {selectedItem.songsTitles.join(", ")}</p>
                      <a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Escuchar en Spotify
                      </a>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg self-center transition duration-300"
                >
                  Cambiar de Contenido
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <SearchInput
                  searchTerm={songSearchTerm}
                  handleSearchTermChange={handleSongSearchTermChange}
                  handleSearch={handleSearch}
                  type="song"
                />
                <SearchResults
                  results={songSearchResults}
                  handleAdd={handleAdd}
                  type="song"
                />
                <SearchInput
                  searchTerm={albumSearchTerm}
                  handleSearchTermChange={handleAlbumSearchTermChange}
                  handleSearch={handleSearch}
                  type="album"
                />
                <SearchResults
                  results={albumSearchResults}
                  handleAdd={handleAdd}
                  type="album"
                />
              </div>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"

              className="w-full py-2 mt-4 bg-ver text-black rounded-lg transition duration-300 bg-color3 hover:bg-color4"

            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;
