import React from 'react';

const MusicPost = ({ post }) => {
  return (
    <div>
      {post.albumTitle && <p>Album: {post.albumTitle}</p>}
      {post.songTitle && <p>Canción: {post.songTitle}</p>}
    </div>
  );
};

export default MusicPost;
