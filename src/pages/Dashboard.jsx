import React, { useEffect, useState, useRef, useCallback } from 'react';
import Post from '../components/post/Post';
import { fetchPosts } from '../serivces/posts/getAllPosts';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(7);
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
            console.log(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const lastPostElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
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
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return <Post ref={lastPostElementRef} key={post.id} post={post} />;
                    } else {
                        return <Post key={post.id} post={post} />;
                    }
                })}
            </ul>
            {isLoading && <p>Loading...</p>}
            {!hasMore && <p>No more posts</p>}
        </div>
    );
}

export default Dashboard;
