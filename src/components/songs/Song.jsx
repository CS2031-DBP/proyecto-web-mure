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
  const { playTrackWithFade, stopTrackWithFade, currentTrack } = useMusicPlayer();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await stopTrackWithFade();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        await stopTrackWithFade();
      }
      await playTrackWithFade(song.spotifyPreviewUrl);
      setIsPlaying(true);
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
    } catch (error) {
      console.error(`Failed to delete song ${id}`, error);
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
            No se encontró la imagen :(
          </div>
        )}
        <div>
          <p className="mb-1">
            <span className="font-semibold">Artista:</span>{" "}
            {song.artistsNames ? song.artistsNames.join(", ") : "Desconocido"}
          </p>
          {song.albumTitle && (
            <p className="mb-1">
              <span className="font-semibold">Álbum:</span> {song.albumTitle}
            </p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Duración:</span> {song.duration}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Género:</span> {song.genre}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Likes:</span> {song.likes}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Número de reproducciones:</span>{" "}
            {song.timesPlayed}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Fecha de Lanzamiento:</span>{" "}
            {song.releaseDate}
          </p>
        </div>
      </div>
      {role === "ROLE_ADMIN" && (
        <button
          className="bg-[#8E3356] text-white px-4 py-2 rounded-full transition duration-300 mt-4"
          onClick={() => handleDelete(song.id)}
        >
          Eliminar Canción
        </button>
      )}
    </div>
  );
});

export default Song;
