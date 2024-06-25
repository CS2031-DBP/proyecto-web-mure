import React, { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MusicPost from './MusicPost';
import { likePost } from '../../services/posts/likePost';
import { dislikePost } from '../../services/posts/dislikePost';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import './postStyle.css';

const Post = forwardRef(({ post }, ref) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/user/${post.ownerId}`);
  };

  const handleLikeClick = async () => {
    try {
      if (liked) {
        const res = await dislikePost(post.id);
        console.log(res);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        const res = await likePost(post.id);
        console.log(res);
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking/disliking the post:', error);
    }
  };

  return (
    <div key={post.id} className='post' ref={ref}>
      <MusicPost albumTitle={post.albumTitle} songTitle={post.songTitle} />
      <button onClick={handleUserClick}> @{post.owner} </button>
      <p>{post.ownerId}</p>
      <p>{post.description}</p>
      <p>Likes: {likes}</p>
      <button onClick={handleLikeClick}>
        {liked ? <Favorite /> : <FavoriteBorder />}
      </button>
    </div>
  );
});

export default Post;
