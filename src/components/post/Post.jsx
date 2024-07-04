import React, { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPost from "./MusicPost";
import { likePost } from "../../services/posts/likePost";
import { dislikePost } from "../../services/posts/dislikePost";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import moment from "moment";
import { motion } from 'framer-motion';

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
      navigate("/profile");
    } else {
      navigate(`/user/${post.ownerId}`);
    }
  };

  const handleLikeClick = async () => {
    try {
      if (liked) {
        await dislikePost(post.id);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await likePost(post.id);
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error("Error liking/disliking the post:", error);
    }
  };

  return (
    <motion.div
      key={post.id}
      className="border p-5 rounded-md shadow-lg bg-white mb-4 flex flex-col w-full max-w-screen-md mx-auto"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex mb-4">
        <div className="flex flex-col items-center mr-4">
          <img
            src={post.profileImage}
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
          <p className="text-sm text-gray-500">
            {moment(post.createdAt).format("LLL")}
          </p>
        </div>
        <div className="flex-1">
          <MusicPost post={post} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-black mb-4 mt-2 flex-grow text-left">
          {post.description}
        </p>
        <div className="flex items-center">
          <p className="text-black mx-2">Likes: {likes}</p>
          <motion.button
            onClick={handleLikeClick}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              liked ? "bg-red-500 text-white" : " text-black"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {liked ? <Favorite /> : <FavoriteBorder />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default Post;
