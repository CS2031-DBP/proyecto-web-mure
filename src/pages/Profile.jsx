import React, { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import { fetchUserFriends } from '../services/profile/getUserFriends';
import { fetchUserPosts } from '../services/profile/getMyPosts';
import ProfileInfo from '../components/profile/ProfileInfo';
import Friends from '../components/profile/Friends';
import Post from '../components/post/Post';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [friends, setFriends] = useState([]);
    const [myposts, setMyPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userdata = await fetchCurrentUser();
                const friendsResponse = await fetchUserFriends();
                const myposts = await fetchUserPosts();
                console.log(userdata.data)
                setUserData(userdata.data);
                setFriends(friendsResponse.data);
                setMyPosts(myposts.data);
            } catch (error) {
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
            {
                friends.length === 0 
                ? <p>Aún no tienes amigos, prueba ir a la pestaña de comunidad para ver posts y hacer amigos</p>
                : <Friends friends={friends} />
            }
            <h1>My Posts</h1>
            {
                myposts.length === 0 
                ? <p>No has hecho ningun post aún</p>
                : myposts.map((post) => (
                    <Post key={post.id} post={post} />
                ))
            }

            <button onClick={() => {navigate("/edit")}}> Editar Perfil </button>

        </div>
    );
}

export default Profile;
