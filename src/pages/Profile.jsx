import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchUserPosts } from "../services/profile/getMyPosts";
import { fetchMyPlaylists } from "../services/playlists/getMyPlaylists";
import Post from "../components/post/Post";
import Playlist from "../components/playlist/Playlist";
import { motion } from "framer-motion";
import { FaPlus, FaUserFriends, FaEdit } from "react-icons/fa";
import {PlaylistAddCheck} from "@mui/icons-material";


const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const [myposts, setMyPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await fetchCurrentUser();
        const myposts = await fetchUserPosts();
        const userPlaylists = await fetchMyPlaylists();
        setUserData(userdata.data);
        setMyPosts(myposts.data);
        setPlaylists(userPlaylists.data);
      } catch (error) {
        setError("Error al obtener los datos del usuario.");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetchMyPlaylists();
      if (response.status === 200) {
        setPlaylists(response.data);
      } else {
        setError("Error fetching playlists");
      }
    } catch (err) {
      setError("Error fetching playlists");
    }
  };

  const handleDeletePost = (postId) => {
    setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const animationVariants = {
    hidden: { opacity: 0, x: 35 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.125 },
    }),
  };

  return (
    <>
      <motion.div
        className="rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          {userData && (
            <motion.div
              className="flex items-center bg-gradient1 p-4 rounded-lg shadow-md w-full"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={animationVariants}
            >
              <div className="w-1/3 flex justify-center items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-black">
                  <img
                    src={userData.profileImage || "default-profile.png"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="w-2/3 text-white text-left">
                <h1 className="text-2xl font-bold">@{userData.name}</h1>
                <p>Cumpleaños: 🎉 {userData.birthDate}</p>
              </div>
            </motion.div>
          )}
          <div className="flex flex-col ml-4">
            <motion.button
              onClick={() => navigate("/friends")}
              className="bg-color1 text-white py-2 rounded-md px-4 mb-2 transition duration-150 flex items-center justify-center hover:bg-color2"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={animationVariants}
            >
              <FaUserFriends className="mr-2" />
              Lista de amigos
            </motion.button>
            <motion.button
              onClick={() => navigate("/edit")}
              className="bg-color1 text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-color2"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={animationVariants}
            >
              <FaEdit className="mr-2" />
              Editar Perfil
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="">
        <div className="flex flex-col md:flex-row mt-8">
          <motion.div
            className="flex-1 md:mr-8 mb-8 md:mb-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4 text-spotify-black">Mis Posts</h1>
            {myposts.length === 0 ? (
              <p className="text-gray-400">No has hecho ningún post aún</p>
            ) : (
              myposts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Post
                    post={post}
                    currUserName={userData.name}
                    currId={userData.id}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4 text-spotify-black">Mis PlayLists</h1>
            {playlists.length === 0 ? (
              <p className="text-gray-400">No tienes playlists aún</p>
            ) : (
              playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                 <Playlist key={playlist.id} playlist={playlist} onUpdate={fetchPlaylists} edit={false} />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
      <button
        onClick={() => navigate("/playlist/create")}
        className="fixed bottom-16 right-5 bg-color1 text-white p-4 rounded-full shadow-lg hover:bg-color2 transition duration-300"
        title="Crear Playlist"
      >
        <PlaylistAddCheck className="text-2xl" />
      </button>
    </>
  );
};

export default Profile;
