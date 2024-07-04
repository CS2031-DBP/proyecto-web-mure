import React, { useEffect, useState, useRef, useCallback } from 'react';
import Post from '../components/post/Post';
import { fetchPosts } from '../services/posts/getAllPosts';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(7);
    const [currUserName, setCurrUserName] = useState('');
    const [currId, setCurrId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const loadPosts = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const res = await fetchPosts(page, size);
            if (res.status === 200) {
                setPosts((prevPosts) => [...prevPosts, ...res.data.content]);
                setPage((prevPage) => prevPage + 1);
                if (res.data.content.length === 0) {
                    setHasMore(false);
                }
            }
        } catch (error) {
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

        }
    };

    useEffect(() => {
        fetchUserName();
        loadPosts();
    }, []);

    const lastPostElementRef = useCallback((node) => {
        if (isLoading) return;
        if ( observer.current ) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadPosts();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center ">

            <div className="hide-scrollbar overflow-auto w-full max-w-5xl h-[calc(100vh-150px)]">
                <ul>
                    {posts.map((post, index) => {
                        if (posts.length === index + 1) {
                            return <Post ref={lastPostElementRef} key={post.id} post={post} currUserName={currUserName} currId={currId} />;
                        } else {
                            return <Post key={post.id} post={post} currUserName={currUserName} currId={currId} />;
                        }
                    })}
                </ul>
            </div>
            {isLoading && <p className="text-center mt-4">Loading...</p>}
            {!hasMore && <p className="text-center mt-4">No more posts</p>}
        </div>
    );
};

export default Dashboard;
