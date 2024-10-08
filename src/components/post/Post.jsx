import React, { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MusicPost from "./MusicPost";
import { likePost } from "../../services/posts/likePost";
import { dislikePost } from "../../services/posts/dislikePost";
import { deletePost } from "../../services/posts/deletePost";
import { fetchCurrentUser } from "../../services/profile/getUserInfo";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Cancel from "@mui/icons-material/Cancel";
import moment from "moment";
import { motion } from "framer-motion";

const Post = forwardRef(({ post, currUserName, currId, onDelete }, ref) => {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");
  const [ownershipError, setOwnershipError] = useState("");
  const [likeError, setLikeError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser.status === 200) {
          setIsOwner(currentUser.data.id === post.ownerId);
        }
      } catch (err) {
        setOwnershipError("Error verifying post ownership.");
      }
    };
    checkOwnership();
  }, [post.ownerId]);

  useEffect(() => {
    if (post.likedByUserIds.includes(currId)) {
      setLiked(true);
    }
  }, [post.likedByUserIds, currId]);

  const handleUserClick = () => {
    if (isOwner) {
      navigate("/user");
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
      setLikeError("Error liking/disliking the post.");
    }
  };

  const handleDeleteClick = async () => {
    try {
      await deletePost(post.id);
      onDelete(post.id);
    } catch (err) {
      setDeleteError("Error deleting post.");
    }
  };

  return (
    <motion.div
      key={post.id}
      className="border p-5 rounded-md shadow-lg bg-white mb-4 flex flex-col w-full max-w-screen-md mx-auto relative"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      {isOwner && (
        <button
          type="button"
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1 transition duration-300"
          title="Delete Post"
          style={{ top: "1rem", right: "1rem" }}
        >
          <Cancel style={{ fill: "red" }} />
        </button>
      )}
      {ownershipError && (
        <p className="text-red-500 text-sm mt-1">{ownershipError}</p>
      )}
      <div className="flex mb-4">
        <div className="flex flex-col items-center mr-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black mb-2">
            <img
              src={post.profileImage}
              alt="profile"
              className="object-cover w-full h-full"
            />
          </div>
          <a
            onClick={handleUserClick}
            className="text-atColor text-lg text-center cursor-pointer hover:text-atColor2"
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
      {post.imageUrl && (
        <div className="mt-4">
          <img
            src={post.imageUrl}
            alt="Post"
            className="w-full object-cover rounded-lg"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
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
      {likeError && <p className="text-red-500 text-sm mt-1">{likeError}</p>}
      {deleteError && (
        <p className="text-red-500 text-sm mt-1">{deleteError}</p>
      )}
    </motion.div>
  );
});

export default Post;
