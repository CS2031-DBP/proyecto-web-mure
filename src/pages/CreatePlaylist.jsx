import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSongsByTitle } from "../services/songs/searchSongByTitle";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { useNavigate } from "react-router-dom";
import { createPlaylist } from "../services/playlists/createPlayllist";
import { motion } from "framer-motion";
import ImageIcon from "@mui/icons-material/Image";
import Cancel from "@mui/icons-material/Cancel";

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userId: "",
    name: "",
    songsIds: [],
    coverImage: null,
  });
  const [songsDetails, setSongsDetails] = useState([]);
  const [songSearchTerm, setSongSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setData({ ...data, coverImage: files[0] });
      setImagePreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (songSearchTerm.length > 2) {
      fetchData(0);
    } else {
      setSearchResults([]);
    }
  }, [songSearchTerm, page]);

  const fetchData = async () => {
    try {
      const results = await searchSongsByTitle(songSearchTerm, page, size);
      setSearchResults(results.data.content);
    } catch (error) {
      setError("Error in handleSearchText.");
    }
  };

  const handleAdd = (id, songDetails) => {
    if (data.songsIds.includes(id)) {
      setError("The song is already added to the playlist.");
      return;
    }

    setData((prevData) => ({
      ...prevData,
      songsIds: [...prevData.songsIds, id],
    }));
    setSongsDetails((prevDetails) => [...prevDetails, songDetails]);
    setSearchResults([]);
    setSongSearchTerm("");
  };

  const handleRemoveSong = (id) => {
    setData((prevData) => ({
      ...prevData,
      songsIds: prevData.songsIds.filter((songId) => songId !== id),
    }));
    setSongsDetails((prevDetails) =>
      prevDetails.filter((song) => song.id !== id)
    );
  };

  useEffect(() => {
    const getId = async () => {
      try {
        const response = await fetchCurrentUser();
        if (response.status === 200) {
          setData((prevData) => ({ ...prevData, userId: response.data.id }));
        }
      } catch (error) {
        setError("Error fetching user info.");
      }
    };
    getId();
  }, []);

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
      const res = await createPlaylist(formData);
      if (res.status === 201) {
        setSuccess("Playlist created successfully.");
        navigate(-1);
      } else {
        setError("Error creating the playlist.");
      }
    } catch (error) {
      setError("Error creating the playlist.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <motion.div
        className="bg-gradient-to-b from-playlistBg1 to-playlistBg2 text-white px-8 py-4 rounded-lg shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium mb-2">
                  Add playlist photo
                </label>
                <div className="relative w-32 h-32 mb-4">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <label className="flex items-center justify-center w-full h-full cursor-pointer rounded-lg bg-inputBgColor">
                      <ImageIcon className="text-gray-500 w-16 h-16" />
                      <input
                        type="file"
                        name="coverImage"
                        accept=".png,.jpg"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </label>
                  )}
                  {imagePreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setData({ ...data, coverImage: null });
                        setImagePreviewUrl("");
                      }}
                      className="absolute top-0 right-0 text-buttonColor rounded-full p-1"
                    >
                      <Cancel />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-8">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Add playlist name"
                  className="w-full px-3 py-2 border rounded-lg bg-inputBgColor text-black mb-4"
                  required
                />
                <SearchInput
                  searchTerm={songSearchTerm}
                  handleSearchTermChange={handleSongSearchTermChange}
                />
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg h-64 overflow-y-auto ">
            {searchResults.length > 0 ? (
              <SearchResults
                results={searchResults}
                handleAdd={(id, item) => handleAdd(id, item)}
                page={page}
                setPage={setPage}
              />
            ) : (
              <>
                {songsDetails.length > 0 ? (
                  songsDetails.map((song) => (
                    <motion.div
                      key={song.id}
                      className="flex items-center justify-between mb-4 w-full"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      style={{ paddingRight: '64px' }}
                    >
                      <div className="flex items-center w-4/5 ml-16">
                        <img
                          src={song.coverImageUrl}
                          alt={`${song.title} cover`}
                          className="w-10 h-10 object-cover rounded-lg mr-2"
                        />
                        <div className="flex flex-col">
                          <p className="font-bold text-sm">{song.title}</p>
                          <p className="text-xs">{song.artistsNames.join(", ")}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSong(song.id)}
                        className="text-red-500"
                      >
                        <Cancel />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-black">No songs added yet.</p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-4 mt-4 items-center">
            <button
              type="submit"
              className="bg-buttonColorPl text-white py-2 px-4 rounded-lg w-3/4"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-buttonColorPl text-white py-2 px-4 rounded-lg w-3/4"
            >
              Back
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePlaylist;
