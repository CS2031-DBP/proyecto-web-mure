import React, { useState, useEffect } from "react";
import { createSong } from "../services/songs/createSong";
import { getArtistByName } from "../services/artist/getArtistByName";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import VerifiedIcon from "@mui/icons-material/Verified";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";

const AddSong = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: "",
    artistsIds: [],
    releaseDate: "",
    genre: "",
    duration: "",
    coverImageUrl: "",
    spotifyUrl: "",
    spotifyPreviewUrl: ""
  });
  const [artistSearchTerm, setArtistSearchTerm] = useState("");
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [addedArtists, setAddedArtists] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const songData = localStorage.getItem("selectedSong");
    if (songData) {
      const parsedData = JSON.parse(songData);
      setData(parsedData);
      setAddedArtists(parsedData.addedArtists || []);
      localStorage.removeItem("selectedSong");
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
        const results = await getArtistByName(artistSearchTerm, 0, 10);
        if (results.status === 200) {
          setArtistSearchResults(results.data.content);
        } else if (results.response && results.response.status === 404) {
          setError("No artists found with that name :(");
          setArtistSearchResults([]);
        } else {
          setError("Error searching for artists.");
        }
      }
    } catch (err) {
      setError("Error searching.");
    }
  };

  const handleAdd = (id, type, artistDetails) => {
    if (type === "artist") {
      if (data.artistsIds.includes(id)) {
        setError("The artist is already added.");
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
      coverImageUrl: data.coverImageUrl,
      spotifyUrl: data.spotifyUrl,
      spotifyPreviewUrl: data.spotifyPreviewUrl
    };

    try {
      const res = await createSong([payload]);
      if (res.status === 201) {
        setSuccess("Song created successfully.");
        navigate("/songs");
      } else {
        setError("Error creating the song.");
      }
    } catch (err) {
      setError("Error creating the song.");
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center bg-[#FFFDF1] px-4 pt-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-bgColor p-4 rounded-xl w-full max-w-2xl mt-8">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
        
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-left text-textPrimary font-poppins"
            >
              Title
            </label>
            <motion.input
              type="text"
              id="title"
              name="title"
              value={data.title}
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium text-left text-textPrimary font-poppins"
            >
              Release Date
            </label>
            <motion.input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={data.releaseDate}
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-left text-textPrimary font-poppins"
            >
              Genre
            </label>
            <motion.input
              type="text"
              id="genre"
              name="genre"
              value={data.genre}
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-left text-textPrimary font-poppins"
            >
              Duration
            </label>
            <motion.input
              type="text"
              id="duration"
              name="duration"
              value={data.duration}
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </div>
          <div className="col-span-1 flex flex-col items-center justify-center">
            <label className="block text-sm font-medium text-left text-textPrimary font-poppins">
              Cover Image
            </label>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="spotifyUrl"
              className="block text-sm font-medium text-left text-textPrimary font-poppins"
            >
              Spotify Link
            </label>
            <motion.input
              type="text"
              id="spotifyUrl"
              name="spotifyUrl"
              value={data.spotifyUrl}
              onChange={handleChange}
              required
              className="w-full p-1 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </div>
          <div className="col-span-1 flex flex-col items-center justify-center">
            {data.coverImageUrl ? (
              <img
                src={data.coverImageUrl}
                alt="Cover"
                className="w-24 h-24 object-cover rounded-lg mt-1"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-inputBgColor rounded-lg text-textPrimary border border-buttonColor mt-1">
                No Image
              </div>
            )}
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
            <button
              type="submit"
              className="w-full py-1.5 mt-2 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
            >
              Add Song
            </button>
          </div>
        </form>
        <div className="fixed bottom-10 right-5 rounded-full h-20">
          <button
            onClick={() => navigate("/song/create/spotify")}
            className="fixed bottom-4 right-4 p-3 shadow-lg text-white rounded-full transition duration-300 bg-buttonColor hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
            title="Search on Spotify"
          >
            <FaSpotify className="text-2xl" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddSong;
