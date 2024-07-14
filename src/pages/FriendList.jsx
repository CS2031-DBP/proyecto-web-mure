import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { deleteFriend } from "../services/friends/deleteFriend";
import Friend from "../components/friend/Friend";

const FriendList = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState(null);

  const loadFriends = async () => {
    try {
      const currentUserResponse = await fetchCurrentUser();
      setCurrentUser(currentUserResponse.data);

      const friendsDataResponse = await fetchUserFriends();
      const friendsData = friendsDataResponse.data.map((friend) => ({
        ...friend,
        profileImageUrl: friend.profileImageUrl || "default-profile.png",
      }));
      setFriends(friendsData);
    } catch (error) {
      setErrors("Failed to load friends data");
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const handleFriendPress = (friendId) => {
    navigate(`/user/${friendId}`);
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(friendId);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
    } catch (error) {
      setErrors("Failed to remove friend");
    }
  };

  return (
    <div className="container mx-auto py-8">
      {errors && <p className="text-red-500">{errors}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {friends.map((friend, index) => (
          <Friend
            key={friend.id}
            friend={friend}
            handleFriendPress={handleFriendPress}
            handleDeleteFriend={handleDeleteFriend}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendList;
