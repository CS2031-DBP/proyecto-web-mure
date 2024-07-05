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
import ProfileInfo from "../components/profile/ProfileInfo";
import Playlist from "../components/playlist/Playlist";
import { motion } from 'framer-motion';

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
    fetchPosts();
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

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Go back</button>
      <ProfileInfo data={user} />
      <div>
        {friends ? (
          <>
            <div>Tu y {user.name} ya son amigos!</div>
            <button onClick={handleDeleteFriend}>Eliminar amigo</button>
          </>
        ) : (
          <button onClick={handleAdd}>Añadir amigo</button>
        )}
      </div>
      <div className="contenido" style={{ display: "flex" }}>
        <div className="posts" style={{ flex: 1, marginRight: "20px" }}>
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <p>This user has not made any posts yet.</p>
          ) : (
            posts.map((post, index) => {
              if (posts.length === index + 1) {
                return (
                  <Post
                    ref={lastPostElementRef}
                    key={post.id}
                    post={post}
                    currUserName={user.name}
                    currId={currUserId}
                    onDelete={handleDeletePost}
                  />
                );
              } else {
                return (
                  <Post
                    key={post.id}
                    post={post}
                    currUserName={user.name}
                    currId={currUserId}
                    onDelete={handleDeletePost}
                  />
                );
              }
            })
          )}
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
        </div>
        <div className="playlists" style={{ flex: 1 }}>
          <h2>Playlists</h2>
          {playlists.length === 0 ? (
            <p>This user has not created any playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <Playlist key={playlist.id} playlist={playlist} edit={true} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
