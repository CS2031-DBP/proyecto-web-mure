import React from "react";
import Headphones from "@mui/icons-material/Headphones";
import HeadsetOff from "@mui/icons-material/HeadsetOff";

// Componente MusicPost que recibe props: post
const MusicPost = ({ post }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm w-full">
      {post.songCoverUrl || post.albumCoverUrl ? (
        <img
          src={post.songCoverUrl || post.albumCoverUrl}
          alt="cover"
          className="w-24 h-auto rounded"
        />
      ) : (
        <div className="w-24 h-auto rounded bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}
      <div className="flex flex-col justify-between text-black flex-1">
        {post.songTitle ? (
          <p className="font-semibold">Canción: {post.songTitle}</p>
        ) : post.albumTitle ? (
          <p className="font-semibold">Álbum: {post.albumTitle}</p>
        ) : (
          <p className="font-semibold">Sin Título</p>
        )}
      </div>
      {post.songUrl || post.albumUrl ? (
        <a href={post.songUrl || post.albumUrl} target="_blank" rel="noopener noreferrer">
          <Headphones className="text-lg text-black" />
        </a>
      ) : (
        <HeadsetOff className="text-lg text-black" />
      )}
    </div>
  );
};

export default MusicPost;
