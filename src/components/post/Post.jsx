// Post.js
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MusicPost from './MusicPost';
import './postStyle.css';

const Post = forwardRef(({ post }, ref) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/user/${post.ownerId}`);
  };

  return (
    <div key={post.id} className='post' ref={ref}>
      <MusicPost albumTitle={post.albumTitle} songTitle={post.songTitle} />
      <button onClick={handleUserClick}> @{post.owner} </button>
      <p>{post.ownerId}</p>
      <p>{post.description}</p>
      <p>Likes: {post.likes}</p>
      <button>Like</button>
    </div>
  );
});

export default Post;
