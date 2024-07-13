import React, { useEffect, useState } from "react";
import { createPost } from "../services/posts/createPost";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSongsByTitle } from '../services/songs/searchSongBy';
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    const getId = async () => {
      try {
        const response = await fetchCurrentUser();
        if (response.status === 200) {
          setData((prevData) => ({ ...prevData, userId: response.data.id }));
        } else {
          throw new Error("Could not fetch user ID.");
        }
      } catch (error) {
        setError("Error fetching user info.");
        console.error("Error getting id:", error);
      }
    };

    getId();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, page]);

  const fetchData = async () => {
    try {
      const songs = await searchSongsByTitle(searchTerm, page, size);
      const albums = await searchAlbum(searchTerm, page, size);

      setSearchResults([
        ...songs.data.content.map(song => ({ ...song, type: "song" })),
        ...albums.data.content.map(album => ({ ...album, type: "album" }))
      ]);
    } catch (error) {
      console.error("Error in handleSearchText:", error);
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

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleAdd = (id, item) => {
    if (item.type === "song") {
      setData((prevData) => ({ ...prevData, songId: id }));
    } else {
      setData((prevData) => ({ ...prevData, albumId: id }));
    }
    setSelectedItem(item);
    setSearchResults([]);
    setSearchTerm("");
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

    const formData = new FormData();
    for (const key in data) {
      if (data[key] !== null) {
        formData.append(key, data[key]);
      }
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
      className="flex items-center justify-center px-6 pt-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-bgColor p-6 rounded-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col">
          <SearchInput
            searchTerm={searchTerm}
            handleSearchTermChange={handleSearchTermChange}
          />
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="What are you thinking about..."
            className="w-full h-32 p-3 border rounded-lg bg-white text-black border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor mb-4"
          />
          <div className="bg-white border rounded-lg p-3">
            <div className="grid grid-cols-2 items-center">
              <label className="block text-sm font-medium mb-1 text-black">
                Add Image
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
            <div className="relative flex items-center border rounded-lg w-full h-40 border-buttonColor">
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col">
          {selectedItem ? (
            <div className="bg-white text-black p-4 rounded-lg flex flex-col justify-between h-full">
              <div className="flex-grow">
                {selectedItem.type === "song" && (
                  <>
                    <img
                      src={selectedItem.coverImage}
                      alt={`${selectedItem.title} cover`}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p className="font-bold text-lg">{selectedItem.title}</p>
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
                      src={selectedItem.coverImage || 'default-image-url'} 
                      alt={`${selectedItem.title} cover`}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <p>Artist: {selectedItem.artistName}</p>
                    <p>Total Duration: {selectedItem.totalDuration}</p>
                    <p>Songs: {selectedItem.songsTitles ? selectedItem.songsTitles.slice(0, 4).join(", ") : "No songs available"}</p>
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
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg self-center transition duration-300"
              >
                Change Content
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <SearchResults
                results={searchResults}
                handleAdd={handleAdd}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
            onClick={handleSubmit}
          >
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
