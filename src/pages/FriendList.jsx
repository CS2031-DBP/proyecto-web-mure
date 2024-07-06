import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { deleteFriend } from "../services/friends/deleteFriend";
import Friend from "../components/friend/Friend";

const FriendList = () => {
  const navigate = useNavigate();
  const { friendIds } = useParams();
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [errors, setErrors] = useState(null);

  const loadFriends = async () => {
    try {
      const currentUserResponse = await fetchCurrentUser();
      setCurrentUser(currentUserResponse.data);

      const friendsDataResponse = await fetchUserFriends(friendIds);

      const friendsData = friendsDataResponse.data.map(friend => ({
        ...friend,
        profileImage: friend.profileImage || "default-profile.png"
      }));
      setFriends(friendsData);
    } catch (error) {
      setErrors("Failed to load friends data");
    }
  };

  useEffect(() => {
    loadFriends();
  }, [friendIds]);

  const handleFriendPress = (friendId) => {
    if (currentUser && friendId === currentUser.id) {
      navigate("/profile");
    } else {
      navigate(`/user/${friendId}`);
    }
  };

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend(friendId);
      setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
    } catch (error) {
      setErrors("Failed to remove friend");
    }
  };

  return (
    <div className="container mx-auto py-8">
      {errors && <p className="text-red-500">{errors}</p>}
      <div className="grid grid-cols-1 gap-6">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <Friend
              key={friend.id}
              friend={friend}
              handleFriendPress={handleFriendPress}
              handleDeleteFriend={handleDeleteFriend}
              index={index}
            />
          ))
        ) : (
          <p className="text-center col-span-1">No friends found</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
