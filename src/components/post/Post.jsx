import React, { forwardRef } from 'react';
import MusicPost from './MusicPost';
import './postStyle.css';

const Post = forwardRef(({ post }, ref) => {
  return (
    <div key={post.id} className='post' ref={ref}>
      <MusicPost albumTitle={post.albumTitle} songTitle={post.songTitle} />
      <p>{post.owner}</p>
      <p>{post.description}</p>
      <p>{post.likes}</p>
    </div>
  );
});

export default Post;
