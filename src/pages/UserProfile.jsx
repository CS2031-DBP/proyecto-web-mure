import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../services/profile/getUserById';
import { getPostsByUser } from '../services/posts/getPostByUserId';
import { getUserPlaylists } from '../services/playlists/getPlaylistsByUserId';
import Post from '../components/post/Post';
import ProfileInfo from '../components/profile/ProfileInfo';
import Playlist from '../components/playlist/Playlist';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
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

    const fetchPlaylists = async () => {
      try {
        const response = await getUserPlaylists(id);
        console.log(response);
        if (response.status === 200) {
          setPlaylists(response.data);
        } else {
          setError('Failed to fetch playlists.');
        }
      } catch (err) {
        setError('Failed to fetch playlists.');
      }
    };

    fetchUser();
    fetchPosts();
    fetchPlaylists();
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

      <div className='contenido' style={{ display: 'flex' }}>
        <div className='posts' style={{ flex: 1, marginRight: '20px' }}>
          <h2>Posts</h2>
          {
            posts.length === 0 
            ? <p>This user has not made any posts yet.</p>
            : posts.slice(0, 2).map((post) => (
                <Post key={post.id} post={post} />
            ))
          }
        </div>

        <div className='playlists' style={{ flex: 1 }}>
          <h2>Playlists</h2>
          {
            playlists.length === 0 
            ? <p>This user has not created any playlists yet.</p>
            : playlists.map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
