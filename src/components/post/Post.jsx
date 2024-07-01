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
        setLikes(likes - 1);
        setLiked(false);
      } else {
        const res = await likePost(post.id);
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking/disliking the post:', error);
    }
  };

  //todo hay que ver si podemos recuperar el link y la imagen de la cancion, para pasarselo a MusicPost y que lo muestre
  
  //todo hay que ver si es que podemos mostrar de forma correcta el tema del audio y la imagen en el post

  //todo, hay que hacer que sea fijo el tamaño del post

  return (
    <div key={post.id} className='post' ref={ref}>
      <MusicPost post={post} />
      {post.owner === currUserName ? (
        <div>{post.owner}</div>
      ) : (
        <button onClick={handleUserClick}>@{post.owner}</button>
      )}
      <p>{post.description}</p>
      <p>Likes: {likes}</p>
      <button onClick={handleLikeClick}>
        {liked ? <Favorite /> : <FavoriteBorder />}
      </button>
    </div>
  );
});

export default Post;
