import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { getUserById } from "../services/profile/getUserById";
import { getPostsByUser } from "../services/posts/getPostByUserId";
import { isFriends } from "../services/friends/isFriends";
import { addFriend } from "../services/friends/addFriend";
import { deleteFriend } from "../services/friends/deleteFriend";
import Post from "../components/post/Post";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserFriends } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useMusicPlayer } from '../contexts/MusicContext';

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [page, setPage] = useState(0);
  const size = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { volume, changeVolume } = useMusicPlayer();
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserResponse = await fetchCurrentUser();
        setCurrUser(currentUserResponse.data);

        if (id) {
          const userResponse = await getUserById(id);
          setUser(userResponse.data);
          setFriendsCount(userResponse.data.friendsIds.length);

          await loadPosts(id, 0);
          const friendsResponse = await isFriends(id);
          setFriends(friendsResponse.data);
        } else {
          setUser(currentUserResponse.data);
          setFriendsCount(currentUserResponse.data.friendsIds.length);
          await loadPosts(currentUserResponse.data.id, 0);
        }
      } catch (err) {
        setError("Error fetching data.");
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) {
      setPosts([]);
      setPage(0);
      setHasMore(true);
    }
  }, [id]);

  const loadPosts = async (userId, page) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await getPostsByUser(userId, page, size);
      if (res.status === 200) {
        setPosts((prevPosts) => [...prevPosts, ...res.data.content]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(res.data.content.length > 0);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts(id || currUser.id, page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

  }, [navigate]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

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
    hidden: { opacity: 0, x: 15 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  const isCurrentUser = !id || currUser?.id === user.id;

  return (
    <div className="flex flex-col items-center bg-crema2">
      <motion.div
        className="rounded-lg w-full max-w-4xl mt-8"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={animationVariants}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-3 gap-4 items-center mb-4 bg-profilePink p-4 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-black">
              <img
                src={user.profileImageUrl || "default-profile.png"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-white mt-2">@{user.nickname}</h1>
          </div>
          <div className="text-white">
            <p className="text-lg">{user.name}</p>
            <p>Birthday: 🎉 {user.birthDate}</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <AnimatePresence>
              {isCurrentUser ? (
                friendsCount > 0 ? (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                  >
                    <span className="text-white">Amigos: {friendsCount}</span>
                    <motion.button
                      onClick={() => navigate("/friends")}
                      className="bg-buttonColor text-white py-2 px-4 ml-2 rounded-full transition duration-150 flex items-center justify-center hover:bg-color2"
                      custom={1}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={animationVariants}
                      transition={{ duration: 0.5 }}
                    >
                      <FaUserFriends />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.p
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    No tienes amigos aún. Prueba a ver posts para conocer gente.
                  </motion.p>
                )
              ) : friends ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  <p className="text-white mr-2">You and {user.name} are friends!</p>
                  <motion.button
                    onClick={handleDeleteFriend}
                    className="bg-buttonColor text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-red-600"
                  >
                    <FaUserFriends className="mr-2" />
                    Remove Friend
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  onClick={handleAddFriend}
                  className="bg-buttonColor text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-color2"
                >
                  <FaUserFriends className="mr-2" />
                  Add Friend
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-4xl mt-2">
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-4 text-black">
            {isCurrentUser ? "My Posts" : `${user.name}'s Posts`}
          </h1>
          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.p
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={animationVariants}
                transition={{ duration: 0.5 }}
                className="text-gray-700"
              >
                {isCurrentUser
                  ? "You haven't posted anything yet"
                  : "This user has not made any posts yet."}
              </motion.p>
            ) : (
              posts.map((post, index) => {
                if (posts.length === index + 1 && hasMore) {
                  return (
                    <Post
                      ref={lastPostElementRef}
                      key={post.id}
                      post={post}
                      currUserName={user.name}
                      currId={user.id}
                      onDelete={isCurrentUser ? handleDeletePost : null}
                    />
                  );
                } else {
                  return (
                    <Post
                      key={post.id}
                      post={post}
                      currUserName={user.name}
                      currId={user.id}
                      onDelete={isCurrentUser ? handleDeletePost : null}
                    />
                  );
                }
              })
            )}
          </AnimatePresence>
          {!hasMore && (
            <motion.div
              className="text-center text-gray-500 py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              No hay más posts
            </motion.div>
          )}
        </motion.div>
      </div>
      {isCurrentUser && (
        <motion.button
          onClick={() => navigate("/edit")}
          className="fixed bottom-24 right-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
          title="Edit Profile"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants}
          transition={{ duration: 0.5 }}
        >
          <EditIcon className="text-2xl" />
        </motion.button>
      )}
      <motion.button
        onClick={() => navigate(`/user/${user.id}/playlists`)}
        className="fixed bottom-5 right-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
        title="View Playlists"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={animationVariants}
        transition={{ duration: 0.5 }}
      >
        <QueueMusicIcon className="text-2xl" />
      </motion.button>
      <motion.button
        onClick={() => setShowVolumeControl(!showVolumeControl)}
        className="fixed bottom-5 left-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
        title="Volume Control"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        }}
        transition={{ duration: 0.3 }}
      >
        <VolumeUpIcon className="text-2xl" />
      </motion.button>
      {showVolumeControl && (
        <motion.div
          className="fixed left-5 bottom-24 bg-white p-2 rounded-lg shadow-lg w-40"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        >

          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(e.target.value)}
            className="w-full"
          />
        </motion.div>
      )}
      {isLoading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default User;
