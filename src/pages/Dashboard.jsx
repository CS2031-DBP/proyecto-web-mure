import React, { useEffect, useState } from 'react'
import Post from '../components/Post';
import { fetchPosts } from '../serivces/posts/getAllPosts';


const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const res = await fetchPosts(page, size);
     
                if (res.status === 200) {
                  console.log(res.data.content);
                    setPosts(res.data.content);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadPosts();
    }, [page, size]);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <Post key={post.id} post={post} />
                ))}
            </ul>
            <button onClick={() => setPage(page + 1)}>Next Page</button>
            <button onClick={() => setSize(size + 10)}>Increase Size</button>
        </div>
    );
}

export default Posts;
