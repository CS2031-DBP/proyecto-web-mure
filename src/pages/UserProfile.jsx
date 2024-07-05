import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { getUserById } from "../services/profile/getUserById";
import { getPostsByUser } from "../services/posts/getPostByUserId";
import { getUserPlaylists } from "../services/playlists/getPlaylistsByUserId";
import { isFriends } from "../services/friends/isFriends";
import { addFriend } from "../services/friends/addFriend";
import { deleteFriend } from "../services/friends/deleteFriend";
import Post from "../components/post/Post";
import Playlist from "../components/playlist/Playlist";
import { motion } from "framer-motion";
import { FaUserFriends, FaUserPlus, FaUserMinus } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState(false);
  const [currUserId, setCurrUserId] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("Failed to fetch user data.");
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await getUserPlaylists(id);
        if (response.status === 200) {
          setPlaylists(response.data);
        } else {
          setError("Failed to fetch playlists.");
        }
      } catch (err) {
        setError("Failed to fetch playlists.");
      }
    };

    const checkFriendship = async () => {
      try {
        const response = await isFriends(id);
        if (response.status === 200) {
          setFriends(response.data);
        } else {
          setFriends(false);
        }
      } catch (err) {
        setFriends(false);
      }
    };

    const fetchCurrentUserId = async () => {
      try {
        const res = await fetchCurrentUser();
        if (res.status === 200) {
          setCurrUserId(res.data.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    loadPosts();
    fetchPlaylists();
    checkFriendship();
    fetchCurrentUserId();
  }, [id]);

  const loadPosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const response = await getPostsByUser(id, page, size);
      if (response.status === 200) {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(response.data.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
      setError("Failed to fetch posts.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, [id]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts();
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

  const handleAdd = async () => {
    try {
      const response = await addFriend(id);
      if (response.status === 204) {
        setFriends(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFriend = async () => {
    try {
      const response = await deleteFriend(id);
      if (response.status === 204) {
        setFriends(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
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

  return (
    <>
      <motion.div
        className="rounded-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          {user && (
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
                    src={user.profileImage || "default-profile.png"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="w-2/3 text-white text-left">
                <h1 className="text-2xl font-bold">@{user.name}</h1>
                <p>Cumpleaños: 🎉 {user.birthDate}</p>
                <div className="mt-4">
                  {friends ? (
                    <>
                      <div className="text-green-500 mb-2">Ya son amigos!</div>
                      <button
                        onClick={handleDeleteFriend}
                        className="bg-red-500 text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-red-700"
                      >
                        <FaUserMinus className="mr-2" />
                        Eliminar amigo
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className="bg-green-500 text-white py-2 px-4 rounded-md transition duration-150 flex items-center justify-center hover:bg-green-700"
                    >
                      <FaUserPlus className="mr-2" />
                      Añadir amigo
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="">
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-1 md:mr-8 mb-8 md:mb-0">
            <h1 className="text-2xl font-bold mb-4 text-spotify-black">Posts</h1>
            {posts.length === 0 ? (
              <p className="text-gray-400">Este usuario no ha hecho ningún post aún.</p>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Post
                    ref={posts.length === index + 1 ? lastPostElementRef : null}
                    post={post}
                    currUserName={user.name}
                    currId={currUserId}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              ))
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4 text-spotify-black">Playlists</h1>
            {playlists.length === 0 ? (
              <p className="text-gray-400">Este usuario no ha creado ninguna playlist aún.</p>
            ) : (
              playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Playlist key={playlist.id} playlist={playlist} edit={true} />
                </motion.div>
              ))
            )}
          </div>
        </div>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default UserProfile;
