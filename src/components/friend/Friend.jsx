import React from "react";
import { motion } from "framer-motion";
import Cancel from "@mui/icons-material/Cancel";

const Friend = ({ friend, handleFriendPress, handleDeleteFriend, index }) => {
  const animationVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <motion.div
      key={friend.id}
      className="bg-white text-black p-6 rounded-lg shadow-md  items-center justify-between mb-4 relative "
      custom={index}
      initial="hidden"
      animate="visible"
      variants={animationVariants}
      style={{ width: "100%" }}
    >
      <button
        type="button"
        onClick={() => handleDeleteFriend(friend.id)}
        className="absolute top-2 right-2 p-1 transition duration-300"
        title="Remove Friend"
      >
        <Cancel style={{ fill: "red" }} />
      </button>
      <div className="flex items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mr-4 bg-gray-100">
          <img
            src={friend.profileImageUrl || "default-profile.png"}
            alt={`${friend.name}'s profile`}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-grow">
          <a
            href="#"
            onClick={() => handleFriendPress(friend.id)}
            className="font-bold text-blue-500"
          >
            {friend.name}
          </a>
          <p className="text-sm">
            {friend.friendsIds.length}{" "}
            {friend.friendsIds.length === 1 ? "Friend" : "Friends"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Friend;
