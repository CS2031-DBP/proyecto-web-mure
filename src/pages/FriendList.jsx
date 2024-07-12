import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { deleteFriend } from "../services/friends/deleteFriend";
import Friend from "../components/friend/Friend";
import pic from "../img/Alone.jpg";

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
      const friendsData = friendsDataResponse.data.map((friend) => ({
        ...friend,
        profileImage: friend.profileImage || "default-profile.png",
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
      <div className="grid grid-cols-1 gap-6 w-96">
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
          <div className="text-center p-10 bg-gradient-to-b from-spotify-black via-spotify-gray to-spotify-black rounded-lg shadow-lg">
            <h1 className="text-3xl font-mono mb-4">
              No se encontraron amigos :(
            </h1>
            <img src={pic} alt="pic" className="mx-auto mb-8 h-96" />
            <button
              onClick={() => navigate("/user")}
              className="bg-color4 text-white py-2 px-4 rounded-full hover:bg-color3 transition duration-300"
            >
              Regresar al Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
