import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById } from "../services/playlists/getPlaylistById";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { searchSongById } from "../services/songs/searchSongById";
import { motion } from "framer-motion";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import Headphones from "@mui/icons-material/Headphones";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const userData = await fetchCurrentUser();
        const playlistData = await getPlaylistById(id);
        setPlaylist(playlistData.data);

        if (playlistData.data.songsIds) {
          const songDetails = await Promise.all(
            playlistData.data.songsIds.map(async (songId) => {
              const songDetail = await searchSongById(songId);
              return songDetail.data;
            })
          );
          setSongs(songDetails);
        }
      } catch (err) {
        console.error("Error fetching playlist data:", err);
        setError(`Failed to load playlist data: ${err.message}`);
      }
    };

    fetchPlaylistData();
  }, [id]);

  const handlePlayPause = async (song) => {
    if (playingTrack?.id === song.id) {
      playingTrack.audio.pause();
      setPlayingTrack(null);
    } else {
      if (playingTrack) {
        playingTrack.audio.pause();
      }
      const audio = new Audio(song.spotifyPreviewUrl);
      audio.volume = volume;
      setPlayingTrack({ id: song.id, audio });
      audio.play();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (playingTrack) {
      playingTrack.audio.volume = newVolume;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <motion.p
          className="text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.p>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white max-w-screen-md">
      <motion.button
        onClick={() => navigate(-1)}
        className="text-white bg-textPrimary p-2 rounded-full fixed top-24 left-4 shadow-lg hover:bg-buttonHover transition duration-300" // Cambiado top-4 a top-16
        initial={{ opacity: 0, y: -70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ArrowBackIcon fontSize="large" />
      </motion.button>
      <motion.div
        className="flex items-center mt-4 text-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={playlist.coverImageUrl}
          alt={playlist.name}
          className="w-48 h-48 rounded-lg shadow-md"
        />
        <div className="ml-6">
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-lg text-gray-600">by {playlist.nickname}</p>
        </div>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {songs.map((song) => (
          <motion.div
            key={song.id}
            className="p-4 bg-white rounded-lg shadow-md flex items-center space-x-4 mb-4 text-black"
            whileHover={{ scale: 1.02 }}
          >
            {song.coverImageUrl ? (
              <img
                src={song.coverImageUrl}
                alt="Cover"
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gray-200"></div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-xl">{song.title}</h3>
              <p className="text-gray-600">
                {song.artistsNames ? song.artistsNames.join(", ") : "Unknown"}
              </p>
              <p className="text-gray-600">{song.albumTitle}</p>
              <p className="text-gray-600">{song.genre}</p>
              <p className="text-gray-600">{song.duration}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              {song.spotifyPreviewUrl ? (
                <button onClick={() => handlePlayPause(song)}>
                  {playingTrack?.id === song.id ? (
                    <Stop className="text-buttonColor" />
                  ) : (
                    <PlayArrow className="text-buttonColor" />
                  )}
                </button>
              ) : (
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Headphones className="text-buttonColor" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={() => setShowVolumeControl(!showVolumeControl)}
        className="fixed bottom-5 left-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
        title="Volume Control"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        }}
        transition={{ duration: 0.3 }}
      >
        <VolumeUpIcon className="text-2xl" />
      </motion.button>
      {showVolumeControl && (
        <motion.div
          className="fixed left-5 bottom-24 bg-white p-2 rounded-lg shadow-lg w-24"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        >
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </motion.div>
      )}
    </div>
  );
};

export default PlaylistPage;
