import React from 'react';

const MusicPost = ({ albumTitle, songTitle }) => {
  return (
    <div>
      <p>{albumTitle}</p>
      <p>{songTitle}</p>
    </div>
  );
};

export default MusicPost;
