import React, { useEffect, useState, useRef, useCallback } from "react";
import Post from "../components/post/Post";
import { fetchPosts } from "../services/posts/getAllPosts";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../contexts/MusicContext'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(7);
  const [currUserName, setCurrUserName] = useState("");
  const [currId, setCurrId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const { stopTrackWithFade } = useMusicPlayer();

  const loadPosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await fetchPosts(page, size);
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

  const fetchUserName = async () => {
    try {
      const res = await fetchCurrentUser();
      if (res.status === 200) {
        setCurrUserName(res.data.name);
        setCurrId(res.data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserName();
    loadPosts();
  }, []);

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

  const handleDeletePost = (id) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-6">
      <div className="hide-scrollbar overflow-auto w-full max-w-6xl flex-1">
        <ul>
          {posts.map((post, index) => {
            if (posts.length === index + 1 && hasMore) {
              return (
                <Post
                  ref={lastPostElementRef}
                  key={post.id}
                  post={post}
                  currUserName={currUserName}
                  currId={currId}
                  onDelete={handleDeletePost}
                />
              );
            } else {
              return (
                <Post
                  key={post.id}
                  post={post}
                  currUserName={currUserName}
                  currId={currId}
                  onDelete={handleDeletePost}
                />
              );
            }
          })}
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
        </ul>
      </div>
      {isLoading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default Dashboard;
