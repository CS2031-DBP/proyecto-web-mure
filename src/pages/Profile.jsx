import React, { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../serivces/profile/getUserInfo';
import { fetchUserFriends } from '../serivces/profile/getUserFriends';
import { fetchUserPosts } from '../serivces/profile/getMyPosts';
import ProfileInfo from '../components/profile/ProfileInfo';
import Friends from '../components/profile/Friends';
import Post from '../components/post/Post';

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [friends, setFriends] = useState([]);
    const [myposts, setMyPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userdata = await fetchCurrentUser();
                const friendsResponse = await fetchUserFriends();
                const myposts = await fetchUserPosts();
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

        </div>
    );
}

export default Profile;
