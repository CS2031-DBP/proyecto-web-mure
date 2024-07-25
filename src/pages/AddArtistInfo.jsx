import React, { useState, useEffect } from "react";
import { checkArtistInDatabase } from "../services/artist/checkArtistInDatabase";
import { createArtists } from "../services/artist/createArtist";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";

const AddArtistInfo = () => {
  const [artists, setArtists] = useState([]);
  const [artistDetails, setArtistDetails] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const missingArtists = JSON.parse(localStorage.getItem("missingArtists"));
    if (missingArtists) {
      setArtists(missingArtists);
      setArtistDetails(
        missingArtists.map((artist) => ({
          name: artist.name,
          description: "",
          birthDate: "",
          verified: false,
          imageUrl: artist.imageUrl,
        }))
      );
    }
  }, []);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...artistDetails];
    updatedDetails[index][field] = value;
    setArtistDetails(updatedDetails);
  };

  const handleVerifiedToggle = (index) => {
    const updatedDetails = [...artistDetails];
    updatedDetails[index].verified = !updatedDetails[index].verified;
    setArtistDetails(updatedDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createArtists(artistDetails);
      const track = JSON.parse(localStorage.getItem("selectedTrack"));
      const newArtistIds = await Promise.all(
        artistDetails.map(async (artist) => {
          const response = await checkArtistInDatabase(artist.name, 0, 1);
          return response.data.content[0].id;
        })
      );
      const songData = {
        title: track.name,
        artistsIds: newArtistIds,
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
    } catch (err) {
      setError("Error saving artist information.");
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center bg-inputBgColor px-6 pt-8 min-h-screen"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-bgColor p-6 rounded-xl w-full max-w-2xl">
        <h1 className="text-3xl font-poppins mb-6 text-center text-fontColor">
          Add Artist Information
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {artistDetails.map((artist, index) => (
            <div
              key={index}
              className="bg-inputBgColor p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-center items-center mb-4">
                <h2 className="text-xl font-poppins font-bold text-black mr-2">
                  {artist.name}
                </h2>
                <VerifiedIcon
                  className={`cursor-pointer ${
                    artist.verified ? "text-blue-500" : "text-gray-400"
                  }`}
                  onClick={() => handleVerifiedToggle(index)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-poppins font-bold text-black mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={artist.birthDate}
                  onChange={(e) =>
                    handleChange(index, "birthDate", e.target.value)
                  }
                  className="w-full p-2 border rounded-md bg-white text-fontColor border-buttonColor"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-poppins font-bold text-black mb-2">
                  Description
                </label>
                <textarea
                  value={artist.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="w-full p-2 border rounded-md bg-white text-fontColor border-buttonColor"
                />
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-buttonColor text-white rounded-lg transition duration-300 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-buttonColor"
          >
            Save Artists and Continue
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddArtistInfo;
