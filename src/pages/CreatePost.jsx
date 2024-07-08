import React, { useEffect, useState } from "react";
import { createPost } from "../services/posts/createPost";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSongsByTitle } from '../services/songs/searchSongBy';
import { searchSongById } from "../services/songs/searchSongById";
import { searchAlbum } from "../services/album/searchAlbum";
import { useNavigate, useLocation } from "react-router-dom";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { motion } from 'framer-motion';
import ImageIcon from '@mui/icons-material/Image';
import Cancel from "@mui/icons-material/Cancel";

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSongId = location.state?.songId || "";

  const [data, setData] = useState({
    userId: "",
    songId: initialSongId,
    albumId: "",
    description: "",
    image: null,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [songSearchTerm, setSongSearchTerm] = useState("");
  const [albumSearchTerm, setAlbumSearchTerm] = useState("");
  const [songSearchResults, setSongSearchResults] = useState([]);
  const [albumSearchResults, setAlbumSearchResults] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    const getId = async () => {
      try {
        const response = await fetchCurrentUser();
        if (response && response.id) {
          setData((prevData) => ({ ...prevData, userId: response.id }));
        } else {
          throw new Error("Could not fetch user ID.");
        }
      } catch (error) {
        setError("Error fetching user info.");
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

  useEffect(() => {
    if (data.songId) {
      fetchSongDetails(data.songId);
    } else if (data.albumId) {
      fetchAlbumDetails(data.albumId);
    }
  }, [data.songId, data.albumId]);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setData({ ...data, image: files[0] });
      setImagePreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
    if (e.target.value) {
      setAlbumSearchTerm("");
      setAlbumSearchResults([]);
      setData((prevData) => ({ ...prevData, albumId: "" }));
    }
  };

  const handleAlbumSearchTermChange = (e) => {
    setAlbumSearchTerm(e.target.value);
    if (e.target.value) {
      setSongSearchTerm("");
      setSongSearchResults([]);
      setData((prevData) => ({ ...prevData, songId: "" }));
    }
  };

  const handleSearch = async (type) => {
    setError("");
    setSuccess("");

    try {
      if (type === "song") {
        const results = await searchSongsByTitle(songSearchTerm, page, size);
        if (results.status === 200) {
          setSongSearchResults(results.data.content);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No songs found with that title :(");
        setSongSearchResults([]);
      } else {
        setError("Error searching for songs.");
      }
    }

    try {
      if (type === "album") {
        const results = await searchAlbum(albumSearchTerm, page, size);
        if (results.status === 200) {
          setAlbumSearchResults(results.data.content);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No albums found with that title :(");
        setAlbumSearchResults([]);
      } else {
        setError("Error searching for albums.");
      }
    }
  };

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

  const handleClearSelection = () => {
    setData((prevData) => ({ ...prevData, songId: "", albumId: "" }));
    setSelectedItem(null);
  };

  const handleClearImage = () => {
    setData((prevData) => ({ ...prevData, image: null }));
    setImagePreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

     console.log(data);

    const formData = new FormData();
    formData.append("userId", data.userId);
    formData.append("songId", data.songId);
    formData.append("albumId", data.albumId);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }

   

    try {
      const res = await createPost(formData);
      if (res.status === 201) {
        setSuccess("Post created successfully.");
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Error creating the post.");
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
      <div className="bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black text-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
 
        <button onClick={() => console.log(data)} className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4">Debug</button>
        <form onSubmit={handleSubmit} className="gap-6">
          <div className="col-span-1 py-6">
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="What are you thinking about..."
              className="w-full h-32 px-3 py-2 border rounded-lg bg-transparent border-white text-white focus:input-focus focus:outline-none focus:ring-1 focus:ring-white"
            />
            <div className="mt-4 bg-transparent border rounded-lg px-3 py-2">
              <div className="grid grid-cols-2 items-center border-transparent bg-transparent">
                <label className="block text-sm font-medium mb-1 border-transparent text-left">
                  Add Image
                </label>
                {imagePreviewUrl && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-red-500 justify-self-end border-transparent"
                  >
                    <Cancel />
                  </button>
                )}
              </div>
              <div className="relative flex items-center border rounded-lg w-full h-40 border-transparent">
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
                        {selectedItem.title}
                      </p>
                      <p>Artist: {selectedItem.artistsNames.join(", ")}</p>
                      <p>Album: {selectedItem.albumTitle}</p>
                      <p>Duration: {selectedItem.duration}</p>
                      <p>Genre: {selectedItem.genre}</p>
                      <a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Listen on Spotify
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
                      <p>Artist: {selectedItem.artistName}</p>
                      <p>Number of Songs: {selectedItem.songsCount}</p>
                      <p>Total Duration: {selectedItem.totalDuration}</p>
                      <p>Songs: {selectedItem.songsTitles ? selectedItem.songsTitles.join(", ") : "No songs available"}</p>
                      <a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        Listen on Spotify
                      </a>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounde-3d-lg self-center transition duration00"
                >
                  Change Content
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

          <div className="col-span-1 md:col-span-2 py-2">
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-ver  text-white rounded-lg  bg-color4 hover:bg-color3 focus:outline-none focus:ring-2 focus:ring-color4 transition duration-300"
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
