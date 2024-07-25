import React, { useState } from "react";
import { getToken, searchTracks } from "../services/spotify/spotify";
import { checkArtistInDatabase } from "../services/artist/checkArtistInDatabase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SpotifyCreate = () => {
  const [title, setTitle] = useState("");
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = await getToken();
      const results = await searchTracks(title, token);
      setTracks(results.slice(0, 5));
    } catch (error) {
      setError("Error searching on Spotify.");
    }
  };

  const handleSelect = async (track) => {
    const artists = track.artists.map((artist) => artist.name);
    const artistIds = [];
    const missingArtists = [];

    for (const artistName of artists) {
      const response = await checkArtistInDatabase(artistName, 0, 1);
      if (response && response.data.content.length > 0) {
        artistIds.push(response.data.content[0].id);
      } else {
        missingArtists.push({
          name: artistName,
          imageUrl: track.album.images[0]?.url || "",
        });
      }
    }

    if (missingArtists.length > 0) {
      localStorage.setItem("missingArtists", JSON.stringify(missingArtists));
      localStorage.setItem("selectedTrack", JSON.stringify(track));
      navigate("/add-artist-info");
      return;
    }

    const songData = {
      title: track.name,
      artistsIds: artistIds,
      releaseDate: track.album.release_date,
      genre: "",
      duration: `${Math.floor(track.duration_ms / 60000)}:${Math.floor(
        (track.duration_ms % 60000) / 1000
      )
        .toFixed(0)
        .padStart(2, "0")}`,
      coverImageUrl: track.album.images[0]?.url || "",
      spotifyUrl: track.external_urls.spotify,
      spotifyPreviewUrl: track.preview_url || "",
    };

    localStorage.setItem("selectedSong", JSON.stringify(songData));
    navigate("/addsong");
  };

  return (
    <motion.div
      className="flex items-center justify-center bg-inputBgColor px-4 pt-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-bgColor p-6 rounded-xl w-full max-w-lg mt-8">
        <h1 className="text-3xl font-poppins mb-6 text-center text-fontColor">
          Search on Spotify
        </h1>
        <form className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md bg-inputBgColor text-fontColor placeholder-placeholderColor border-buttonColor focus:outline-none focus:ring-1 focus:ring-buttonColor"
              placeholder="Song title"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={handleSearch}
              className="w-full py-2 mt-4 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
            >
              Search
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              type="button"
              className="w-full py-2 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
              onClick={() => navigate("/AddSong")}
            >
              Back
            </button>
          </motion.div>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
        <div className="mt-6 space-y-4">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              className="bg-inputBgColor p-4 rounded-lg flex items-center transition duration-100 hover:shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={track.album.images[0]?.url || ""}
                alt={`${track.name} cover`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <p className="font-bold text-fontColor">{track.name}</p>
                <p className="text-fontColor">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                <button
                  onClick={() => handleSelect(track)}
                  className="rounded-full bg-buttonColor hover:bg-opacity-90 text-white px-4 py-2 transition duration-300 mt-2"
                >
                  Select
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SpotifyCreate;
