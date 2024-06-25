import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../services/profile/getUserById';
import { getPostsByUser } from '../services/posts/getPostByUserId'
import Post from '../components/post/Post';
import ProfileInfo from '../components/profile/ProfileInfo';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        setError('Failed to fetch user data.');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await getPostsByUser(id);
        if (response.status === 200) {
          setPosts(response.data);
        } else {
          setError('Failed to fetch posts.');
        }
      } catch (err) {
        setError('Failed to fetch posts.');
      }
    };

    fetchUser();
    fetchPosts();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <ProfileInfo data={user} />
      
      <h2>Posts</h2>
      {
        posts.length === 0 
        ? <p>This user has not made any posts yet.</p>
        : posts.slice(0, 2).map((post) => (
            <Post key={post.id} post={post} />
        ))
      }
    </div>
  );
};

export default UserProfile;
