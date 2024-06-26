import React, { forwardRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MusicPost from './MusicPost';
import { likePost } from '../../services/posts/likePost';
import { dislikePost } from '../../services/posts/dislikePost';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import './postStyle.css';

const Post = forwardRef(({ post, currUserName, currId }, ref) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (post.likedByUserIds.includes(currId)) {
      setLiked(true);
    }
  }, [post.likedByUserIds, currUserName]);

  const handleUserClick = () => {
    if (post.owner === currUserName) {
      navigate('/profile');
    } else {
      navigate(`/user/${post.ownerId}`);
    }
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
      {post.owner === currUserName ? (
        <div>{post.owner}</div>
      ) : (
        <button onClick={handleUserClick}>@{post.owner}</button>
      )}
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
