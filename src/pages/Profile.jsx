import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchUserPosts } from "../services/profile/getMyPosts";
import { fetchMyPlaylists } from "../services/playlists/getMyPlaylists";
import ProfileInfo from "../components/profile/ProfileInfo";
import Friends from "../components/profile/Friends";
import Post from "../components/post/Post";
import Playlist from "../components/playlist/Playlist";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [friends, setFriends] = useState([]);
  const [myposts, setMyPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await fetchCurrentUser();
        const friendsResponse = await fetchUserFriends();
        const myposts = await fetchUserPosts();
        const userPlaylists = await fetchMyPlaylists();
        setUserData(userdata.data);
        setFriends(friendsResponse.data);
        setMyPosts(myposts.data);
        setPlaylists(userPlaylists.data);
      } catch (error) {
        setError("Error al obtener los datos del usuario.");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDeletePost = (postId) => {
    setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <>
      <div className="p-8  px-96 bg-gradient-to-br from-blue-500 to-purple-500  rounded-lg">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => navigate("/playlist/create")}
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Crear Playlist
          </button>
        </div>
        {userData && <ProfileInfo key={userData.id} data={userData} />}
      </div>

      <div className="p-8">
        {friends.length === 0 ? (
          <p className="text-center text-gray-400">
            Aún no tienes amigos, prueba ir a la pestaña de comunidad para ver
            posts y hacer amigos
          </p>
        ) : (
          <Friends friends={friends} />
        )}
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-1 md:mr-8 mb-8 md:mb-0">
            <h1 className="text-2xl font-bold mb-4">Mis Posts</h1>
            {myposts.length === 0 ? (
              <p className="text-gray-400">No has hecho ningún post aún</p>
            ) : (
              myposts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  currUserName={userData.name}
                  currId={userData.id}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">Mis PlayLists</h1>
            {playlists.length === 0 ? (
              <p className="text-gray-400">No tienes playlists aún</p>
            ) : (
              playlists.map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} edit={false} />
              ))
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/edit")}
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Editar Perfil
          </button>
        </div>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default Profile;
