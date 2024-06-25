import React, { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { fetchUserFriends } from '../services/profile/getUserFriends';
import { fetchUserPosts } from '../services/profile/getMyPosts';
import { fetchMyPlaylists } from '../services/playlists/getMyPlaylists';
import ProfileInfo from '../components/profile/ProfileInfo';
import Friends from '../components/profile/Friends';
import Post from '../components/post/Post';
import Playlist from '../components/playlist/Playlist';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [friends, setFriends] = useState([]);
    const [myposts, setMyPosts] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userdata = await fetchCurrentUser();
                const friendsResponse = await fetchUserFriends();
                const myposts = await fetchUserPosts();
                const userPlaylists = await fetchMyPlaylists();
                console.log(userdata.data);
                setUserData(userdata.data);
                setFriends(friendsResponse.data);
                setMyPosts(myposts.data);
                setPlaylists(userPlaylists.data);
            } catch (error) {
                setError('Error al obtener los datos del usuario.');
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/playlist/create")}>Crear Playlist</button>
            <ProfileInfo key={userData.id} data={userData} />
            {friends.length === 0 
                ? <p>Aún no tienes amigos, prueba ir a la pestaña de comunidad para ver posts y hacer amigos</p>
                : <Friends friends={friends} />
            }
            <div className='contenido' style={{ display: 'flex' }}>
                <div className='posts' style={{ flex: 1, marginRight: '20px' }}>
                    <h1>My Posts</h1>
                    {myposts.length === 0 
                        ? <p>No has hecho ningun post aún</p>
                        : myposts.map((post) => (
                            <Post key={post.id} post={post} />
                        ))
                    }
                </div>
                <div className='playlists' style={{ flex: 1 }}>
                    <h1>My Playlists</h1>
                    {playlists.length === 0 
                        ? <p>No tienes playlists aún</p>
                        : playlists.map((playlist) => (
                            <Playlist key={playlist.id} playlist={playlist} />
                        ))
                    }
                </div>
            </div>
            <button onClick={() => {navigate("/edit")}}> Editar Perfil </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Profile;
