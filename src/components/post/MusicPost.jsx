import React from "react";
import Headphones from "@mui/icons-material/Headphones";
import "./MusicPost.css";

// Componente MusicPost que recibe props: post
const MusicPost = ({ post }) => {
  return (
    <div>
      {post.albumTitle && (
        <p>
          Álbum: {post.albumTitle}
          {post.albumUrl && (
            <a href={post.albumUrl} target="_blank" rel="noopener noreferrer">
              <Headphones className="ml-2 text-lg text-black" />
            </a>
          )}
        </p>
      )}
      {post.albumCoverUrl && (
        <img
          src={post.albumCoverUrl}
          alt="cover"
          className="w-48 h-auto rounded mt-4"
        />
      )}

      {post.songTitle && (
        <p>
          Canción: {post.songTitle}
          <a href={post.songUrl} target="_blank" rel="noopener noreferrer">
            <Headphones className="ml-2 text-lg text-black" />
          </a>
        </p>
      )}
      {post.songCoverUrl && (
        <img
          src={post.songCoverUrl}
          alt="cover"
          className="w-48 h-auto rounded mt-4"
        />
      )}
    </div>
  );
};

export default MusicPost;
