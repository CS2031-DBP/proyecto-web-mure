import React, { useState, useEffect, forwardRef } from "react";
import { deleteSong } from "../../services/songs/deleteSong";
import { useNavigate } from "react-router-dom";
import Send from "@mui/icons-material/Send";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import Headphones from "@mui/icons-material/Headphones";
import { useMusicPlayer } from '../../contexts/MusicContext'; 

const Song = forwardRef(({ song, role, onDelete }, ref) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const { playTrack, stopTrack, currentTrack } = useMusicPlayer();
  const [error, setError] = useState("");

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await stopTrack();
        setIsPlaying(false);
      } else {
        if (currentTrack) {
          await stopTrack();
        }
        await playTrack(song.spotifyPreviewUrl);
        setIsPlaying(true);
      }
    } catch (err) {
      setError("Failed to play or stop the track.");
    }
  };

  useEffect(() => {
    if (currentTrack) {
      const handleEnded = () => setIsPlaying(false);
      currentTrack.addEventListener('ended', handleEnded);
      return () => currentTrack.removeEventListener('ended', handleEnded);
    }
  }, [currentTrack]);

  const handleDelete = async (id) => {
    try {
      const res = await deleteSong(id);
      if (res.status === 204) {
        onDelete(id);
      }
    } catch (err) {
      setError(`Failed to delete song ${id}`);
    }
  };

  const handleCreatePost = () => {
    navigate("/post/create", { state: { songId: song.id } });
  };

  return (
    <div
      ref={ref}
      className="border rounded-2xl shadow-lg bg-[#D9D9D9] text-black w-80 flex flex-col justify-between min-h-[450px] p-4"
    >
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <Send className="text-[#676A6F] cursor-pointer" onClick={handleCreatePost} />
          <h2 className="text-xl font-bold">{song.title}</h2>
          {song.spotifyPreviewUrl ? (
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <Stop className="text-[#5F6368]" />
              ) : (
                <PlayArrow className="text-[#5F6368]" />
              )}
            </button>
          ) : (
            <a href={song.link} target="_blank" rel="noopener noreferrer">
              <Headphones className="text-[#5F6368]" />
            </a>
          )}
        </div>
        {song.coverImageUrl ? (
          <img
            src={song.coverImageUrl}
            alt={`${song.title} cover`}
            className="w-full h-full object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg mb-4 text-red-500">
            Image not found :(
          </div>
        )}
        <div>
          <p className="mb-1">
            <span className="font-semibold">Artist:</span>{" "}
            {song.artistsNames ? song.artistsNames.join(", ") : "Unknown"}
          </p>
          {song.albumTitle && (
            <p className="mb-1">
              <span className="font-semibold">Album:</span> {song.albumTitle}
            </p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Duration:</span> {song.duration}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Genre:</span> {song.genre}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Likes:</span> {song.likes}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Number of plays:</span>{" "}
            {song.timesPlayed}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Release Date:</span>{" "}
            {song.releaseDate}
          </p>
        </div>
      </div>
      {role === "ROLE_ADMIN" && (
        <button
          className="bg-[#8E3356] text-white px-4 py-2 rounded-full transition duration-300 mt-4"
          onClick={() => handleDelete(song.id)}
        >
          Delete Song
        </button>
      )}
    </div>
  );
});

export default Song;
