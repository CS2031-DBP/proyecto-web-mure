import React from 'react';
import Headphones from '@mui/icons-material/Headphones';
import './MusicPost.css';

const MusicPost = ({ post }) => {
  return (
    <div>
      {post.albumTitle && <p>Album: {post.albumTitle}</p>}
      {post.songTitle && (
        <p>
          Canción: {post.songTitle}
          <a href={post.songUrl} target="_blank" rel="noopener noreferrer">
            <Headphones className="music-post-icon" />
          </a>
        </p>
      )}
      {post.songCoverUrl && <img src={post.songCoverUrl} alt="cover" className="music-post-cover" />}
    </div>
  );
};

export default MusicPost;
