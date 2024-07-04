import React from "react";
import Headphones from "@mui/icons-material/Headphones";
import HeadsetOff from "@mui/icons-material/HeadsetOff";
import { motion } from 'framer-motion';

const MusicPost = ({ post }) => {
  const { song, album } = post;

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm w-full">
      {song?.coverUrl || album?.coverUrl ? (
        <motion.img
          src={song?.coverUrl || album?.coverUrl}
          alt="cover"
          className="w-24 h-auto rounded"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="w-24 h-auto rounded bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between text-black">
        {song ? (
          <>
            <p className="font-semibold">Canción: {song.title}</p>
            <p>Artista: {song.artist[0].name}</p>
            <p>Género: {song.genre}</p>
            <p>Duración: {song.duration}</p>
          </>
        ) : album ? (
          <>
            <p className="font-semibold">Álbum: {album.title}</p>
            <p>Artista: {album.artist}</p>
            <p>Duración: {album.duration}</p>
            <p>Canciones: {album.songs.join(", ")}</p>
          </>
        ) : (
          <p className="font-semibold">Sin Título</p>
        )}
      </div>
      {song?.url || album?.url ? (
        <a href={song?.url || album?.url} target="_blank" rel="noopener noreferrer">
          <Headphones className="text-lg text-black" />
        </a>
      ) : (
        <HeadsetOff className="text-lg text-black" />
      )}
    </div>
  );
};

export default MusicPost;
