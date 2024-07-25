import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistById } from "../services/playlists/getPlaylistById";
import { updatePlaylist} from "../services/playlists/updatePlaylist";
import { removeSongFromPlaylist } from "../services/playlists/removeSongFromPlaylist";
import { addSongToPlaylist } from "../services/playlists/addSongToPlaylist";
import SearchInput from "../components/search/SearchInput";
import SearchResults from "../components/search/SearchResults";
import { searchSongById } from "../services/songs/searchSongById";
import { searchSongsByTitle } from "../services/songs/searchSongByTitle";
import { motion } from 'framer-motion';
import ImageIcon from "@mui/icons-material/Image";
import Cancel from "@mui/icons-material/Cancel";

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
  const [image, setImage] = useState(null);
  const [songsDetails, setSongsDetails] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const fetchPlaylist = async () => {
    try {
      const response = await getPlaylistById(id);
      if (response.status === 200) {
        setPlaylist(response.data);
        setFetchError("");
        const details = await Promise.all(
          response.data.songsIds.map(async (songId) => {
            const res = await searchSongById(songId);
            return res.data;
          })
        );
        setSongsDetails(details);
      }
    } catch (err) {
      setFetchError("Failed to fetch playlist data.");
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    if (songSearchTerm.length > 2) {
      fetchData();
    } else {
      setSongSearchResults([]);
    }
  }, [songSearchTerm, page]);

  const fetchData = async () => {
    try {
      const results = await searchSongsByTitle(songSearchTerm, page, size);
      setSongSearchResults(results.data.content);
    } catch (error) {
      setError("Error in handleSearchText.");
    }
  };

  const handleSongSearchTermChange = (e) => {
    setSongSearchTerm(e.target.value);
    setPage(0);
  };

  const handleAdd = async (id, songDetails) => {
    if (playlist.songsIds.includes(id)) {
      setError("The song is already added to the playlist.");
      return;
    }

    try {
      await addSongToPlaylist(playlist.id, id);
      setSongsDetails((prevDetails) => [...prevDetails, songDetails]);
      setSongSearchResults([]);
      setSongSearchTerm("");
      fetchPlaylist();
    } catch (error) {
      setError("Error adding song to playlist.");
    }
  };

  const handleRemoveSong = async (id) => {
    try {
      await removeSongFromPlaylist(playlist.id, id);
      setSongsDetails((prevDetails) =>
        prevDetails.filter((song) => song.id !== id)
      );
      fetchPlaylist();
    } catch (error) {
      setError("Error removing song from playlist.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("id", playlist.id);
    formData.append("name", playlist.name);
    if (image) {
      formData.append("coverImage", image);
    }

    try {
      await updatePlaylist(formData);
      navigate(-2);
    } catch (err) {
      setError("Error updating playlist.");
    }
  };

  if (fetchError) {
    return <p>{fetchError}</p>;
  }

  if (!playlist) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center mt-10">
      <motion.div
        className="bg-gradient-to-b from-[#F39560] to-[#C7486A] text-white px-8 py-4 rounded-lg shadow-lg w-full max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleUpdatePlaylist} className="grid grid-cols-1 gap-2">
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium mb-2">
                  Edit playlist photo
                </label>
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={imagePreviewUrl || playlist.coverImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <label className="flex items-center justify-center w-full h-full cursor-pointer rounded-lg bg-inputBgColor absolute inset-0 opacity-5 hover:opacity-90 transition-opacity">
                    <ImageIcon className="text-gray-500 w-16 h-16" />
                    <input
                      type="file"
                      name="coverImage"
                      accept=".png,.jpg"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                  {imagePreviewUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
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
                  value={playlist.name}
                  onChange={(e) => setPlaylist({ ...playlist, name: e.target.value })}
                  placeholder="Edit playlist name"
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
            {songSearchResults.length > 0 ? (
              <SearchResults
                results={songSearchResults}
                handleAdd={handleAdd}
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

export default EditPlaylist;
