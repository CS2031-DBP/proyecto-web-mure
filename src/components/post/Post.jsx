import React, { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPost from "./MusicPost";
import { likePost } from "../../services/posts/likePost";
import { dislikePost } from "../../services/posts/dislikePost";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

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
        await dislikePost(post.id); // Llama a la API para hacer dislike al post
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likePost(post.id); // Llama a la API para hacer like al post
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking/disliking the post:", error); // Manejo de errores
    }
  };

  return (
    <div
      key={post.id}
      className="border p-5 rounded-md shadow-lg bg-white mb-4 flex flex-col w-full max-w-screen-md mx-auto"
      ref={ref}
      style={{ height: "250px" }}
    >
      <div className="flex mb-4">
        <div className="flex flex-col items-center mr-4">
          <img
            src={post.profile_image}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2"
          />
          <a
            href="#"
            onClick={handleUserClick}
            className="text-blue-500 text-lg text-center"
          >
            @{post.owner}
          </a>
        </div>
        <div className="flex-1">
          <MusicPost post={post} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-black mb-4 flex-grow text-left">{post.description}</p>
        <div className="flex items-center">
          <button onClick={handleLikeClick} className="flex items-center mr-2">
            {liked ? <Favorite /> : <FavoriteBorder />}
          </button>
          <p>{likes}</p>
        </div>
      </div>
    </div>
  );
});

export default Post;
