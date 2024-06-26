import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { getUserById } from '../services/profile/getUserById';
import { getPostsByUser } from '../services/posts/getPostByUserId';
import { getUserPlaylists } from '../services/playlists/getPlaylistsByUserId';
import { isFriends } from '../services/friends/isFriends';
import { addFriend } from '../services/friends/addFriend';
import { deleteFriend } from '../services/friends/deleteFriend';
import Post from '../components/post/Post';
import ProfileInfo from '../components/profile/ProfileInfo';
import Playlist from '../components/playlist/Playlist';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState(false);
  const [currUserId, setCurrUserId] = useState('');

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
        if (response.status === 200) {
          setPlaylists(response.data);
        } else {
          setError('Failed to fetch playlists.');
        }
      } catch (err) {
        setError('Failed to fetch playlists.');
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

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

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
      <div className='contenido' style={{ display: 'flex' }}>
        <div className='posts' style={{ flex: 1, marginRight: '20px' }}>
          <h2>Posts</h2>
          {
            posts.length === 0 
            ? <p>This user has not made any posts yet.</p>
            : posts.slice(0, 2).map((post) => (
                <Post key={post.id} post={post} currUserName={user.name} currId={currUserId} />
            ))
          }
        </div>
        <div className='playlists' style={{ flex: 1 }}>
          <h2>Playlists</h2>
          {
            playlists.length === 0 
            ? <p>This user has not created any playlists yet.</p>
            : playlists.map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} edit={true} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
