import React, { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPost from "./MusicPost";
import { likePost } from "../../services/posts/likePost";
import { dislikePost } from "../../services/posts/dislikePost";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import "./postStyle.css";

// Componente Post que recibe props: post, currUserName, currId y ref
const Post = forwardRef(({ post, currUserName, currId }, ref) => {
  const [likes, setLikes] = useState(post.likes); // Estado para manejar los likes del post
  const [liked, setLiked] = useState(false); // Estado para manejar si el post está likeado por el usuario actual
  const navigate = useNavigate(); // Hook de navegación para redirigir a otras páginas

  // useEffect para verificar si el usuario actual ha likeado el post
  useEffect(() => {
    if (post.likedByUserIds.includes(currId)) {
      setLiked(true);
    }
  }, [post.likedByUserIds, currUserName]);

  // Función para manejar el click en el nombre del usuario que creó el post
  const handleUserClick = () => {
    if (post.owner === currUserName) {
      navigate("/profile");
    } else {
      navigate(`/user/${post.ownerId}`);
    }
  };

  // Función para manejar el like y dislike del post
  const handleLikeClick = async () => {
    try {
      if (liked) {
        const res = await dislikePost(post.id); // Llama a la API para hacer dislike al post
        setLikes(likes - 1);
        setLiked(false);
      } else {
        const res = await likePost(post.id); // Llama a la API para hacer like al post
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking/disliking the post:", error); // Manejo de errores
    }
  };

  //todo hay que ver si podemos recuperar el link y la imagen de la canción, para pasárselo a MusicPost y que lo muestre

  //todo hay que ver si es que podemos mostrar de forma correcta el tema del audio y la imagen en el post

  //todo, hay que hacer que sea fijo el tamaño del post

  return (
    <div
      key={post.id}
      className="border p-5 rounded-md shadow-lg bg-white mb-4"
      ref={ref}
    >
      <MusicPost post={post} />
      {post.owner === currUserName ? (
        <div>{post.owner}</div>
      ) : (
        <button onClick={handleUserClick} className="text-blue-500">
          @{post.owner}
        </button>
      )}
      <p>{post.description}</p>
      <p>Likes: {likes}</p>
      <button onClick={handleLikeClick} className="flex items-center">
        {liked ? <Favorite /> : <FavoriteBorder />}
      </button>
    </div>
  );
});

export default Post;
