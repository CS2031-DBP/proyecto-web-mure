import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { getUserById } from "../services/profile/getUserById";
import { getPostsByUser } from "../services/posts/getPostByUserId";
import { getUserPlaylists } from "../services/playlists/getPlaylistsByUserId";
import { fetchMyPlaylists } from "../services/playlists/getMyPlaylists";
import { isFriends } from "../services/friends/isFriends";
import { addFriend } from "../services/friends/addFriend";
import { deleteFriend } from "../services/friends/deleteFriend";
import Post from "../components/post/Post";
import Playlist from "../components/playlist/Playlist";
import { motion } from "framer-motion";
import { FaUserFriends, FaEdit } from "react-icons/fa";
import { PlaylistAddCheck } from "@mui/icons-material";

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState(false);
  const [pagePosts, setPagePosts] = useState(0);
  const [pagePlaylists, setPagePlaylists] = useState(0);
  const size = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserResponse = await fetchCurrentUser();
        setCurrUser(currentUserResponse.data);

        if (id) {
          const userResponse = await getUserById(id);
          setUser(userResponse.data);

          const userPostsResponse = await getPostsByUser(id, pagePosts, size);
          setPosts(userPostsResponse.data.content);

          const userPlaylistsResponse = await getUserPlaylists(id, pagePlaylists, size);
          setPlaylists(userPlaylistsResponse.data.content);

          const friendsResponse = await isFriends(id);
          setFriends(friendsResponse.data);
        } else {
          setUser(currentUserResponse.data);

          const userPostsResponse = await getPostsByUser(currentUserResponse.data.id, pagePosts, size);
          setPosts(userPostsResponse.data.content);

          const userPlaylistsResponse = await fetchMyPlaylists(pagePlaylists, size);
          setPlaylists(userPlaylistsResponse.data.content);
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      }
    };
    fetchData();
  }, [id, pagePosts, pagePlaylists]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const handleNextPagePosts = () => setPagePosts((prevPage) => prevPage + 1);
  const handlePreviousPagePosts = () =>
    setPagePosts((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));

  const handleNextPagePlaylists = () =>
    setPagePlaylists((prevPage) => prevPage + 1);
  const handlePreviousPagePlaylists = () =>
    setPagePlaylists((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));

  const handleAddFriend = async () => {
    try {
      await addFriend(id);
      setFriends(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFriend = async () => {
    try {
      await deleteFriend(id);
      setFriends(false);
    } catch (error) {
      console.error(error);
    }
  };

  const animationVariants = {
    hidden: { opacity: 0, x: 35 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.125 },
    }),
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  const isCurrentUser = !id || currUser?.id === user.id;

  return (
    <div className="min-h-screen">
      <motion.div
        className="rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
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
                  src={user.profileImageUrl || "default-profile.png"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="w-2/3 text-white text-left">
              <h1 className="text-2xl font-bold">@{user.nickname}</h1>
              <p className="text-lg">{user.name}</p>
              <p>Birthday: 🎉 {user.birthDate}</p>
            </div>
          </motion.div>
          <div className="flex flex-col ml-4">
            {isCurrentUser ? (
              <>
                <motion.button
                  onClick={() => navigate("/friends")}
                  className="bg-color1 text-white py-2 rounded-md px-4 mb-2 transition duration-150 flex items-center justify-center hover:bg-color2"
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={animationVariants}
                >
                  <FaUserFriends className="mr-2" />
                  Friends List
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
                  Edit Profile
                </motion.button>
              </>
            ) : friends ? (
              <motion.button
                onClick={handleDeleteFriend}
                className="bg-red-500 text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-red-600"
              >
                <FaUserFriends className="mr-2" />
                Remove Friend
              </motion.button>
            ) : (
              <motion.button
                onClick={handleAddFriend}
                className="bg-color1 text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-color2"
              >
                <FaUserFriends className="mr-2" />
                Add Friend
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row mt-8">
        <motion.div
          className="flex-1 md:mr-8 mb-8 md:mb-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4 text-spotify-black">
            {isCurrentUser ? "My Posts" : `${user.name}'s Posts`}
          </h1>
          {posts.length === 0 ? (
            <p className="text-gray-400">
              {isCurrentUser
                ? "You haven't posted anything yet"
                : "This user has not made any posts yet."}
            </p>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Post
                  post={post}
                  currUserName={user.name}
                  currId={user.id}
                  onDelete={isCurrentUser ? handleDeletePost : null}
                />
              </motion.div>
            ))
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPagePosts}
              disabled={pagePosts === 0}
            >
              Previous
            </button>
            <button onClick={handleNextPagePosts}>Next</button>
          </div>
        </motion.div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4 text-spotify-black">
            {isCurrentUser ? "My Playlists" : `${user.name}'s Playlists`}
          </h1>
          {playlists.length === 0 ? (
            <p className="text-gray-400">
              {isCurrentUser
                ? "You don't have any playlists yet"
                : "This user has not created any playlists yet."}
            </p>
          ) : (
            playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Playlist
                  key={playlist.id}
                  playlist={playlist}
                  onUpdate={() => {}}
                  edit={isCurrentUser}
                />
              </motion.div>
            ))
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPagePlaylists}
              disabled={pagePlaylists === 0}
            >
              Previous
            </button>
            <button onClick={handleNextPagePlaylists}>Next</button>
          </div>
        </motion.div>
      </div>
      {isCurrentUser && (
        <button
          onClick={() => navigate("/playlist/create")}
          className="fixed bottom-16 right-5 bg-color1 text-white p-4 rounded-full shadow-lg hover:bg-color2 transition duration-300"
          title="Create Playlist"
        >
          <PlaylistAddCheck className="text-2xl" />
        </button>
      )}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default User;
