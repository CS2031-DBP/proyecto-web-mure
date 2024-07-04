import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { fetchUserFriends } from "../services/profile/getUserFriends";
import { fetchUserPosts } from "../services/profile/getMyPosts";
import { fetchMyPlaylists } from "../services/playlists/getMyPlaylists";
import ProfileInfo from "../components/profile/ProfileInfo";
import Friends from "../components/profile/Friends";
import Post from "../components/post/Post";
import Playlist from "../components/playlist/Playlist";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({}); // Estado para almacenar los datos del usuario
  const [friends, setFriends] = useState([]); // Estado para almacenar la lista de amigos
  const [myposts, setMyPosts] = useState([]); // Estado para almacenar los posts del usuario
  const [playlists, setPlaylists] = useState([]); // Estado para almacenar las playlists del usuario
  const [error, setError] = useState(""); // Estado para manejar errores

  // useEffect para cargar los datos del usuario al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await fetchCurrentUser(); // Llamada a la API para obtener los datos del usuario
        const friendsResponse = await fetchUserFriends(); // Llamada a la API para obtener los amigos del usuario
        const myposts = await fetchUserPosts(); // Llamada a la API para obtener los posts del usuario
        const userPlaylists = await fetchMyPlaylists(); // Llamada a la API para obtener las playlists del usuario
        setUserData(userdata.data); // Actualiza el estado con los datos del usuario
        setFriends(friendsResponse.data); // Actualiza el estado con la lista de amigos
        setMyPosts(myposts.data); // Actualiza el estado con los posts del usuario
        setPlaylists(userPlaylists.data); // Actualiza el estado con las playlists del usuario
      } catch (error) {
        setError("Error al obtener los datos del usuario."); // Manejo de errores
        console.error(error); // Log de errores en la consola
      }
    };
    fetchData(); // Llama a la función para cargar los datos
  }, []);

  return (
    <>
      {/* Contenedor principal del perfil con gradiente de fondo */}
      <div className="p-8  px-96 bg-gradient-to-br from-blue-500 to-purple-500  rounded-lg">
        <div className="flex space-x-4 mb-4">
          {/* Botón para crear una nueva playlist */}
          <button
            onClick={() => navigate("/playlist/create")}
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Crear Playlist
          </button>
        </div>
        {/* Muestra la información del usuario */}
        {userData && <ProfileInfo key={userData.id} data={userData} />}
      </div>

      {/* Contenedor secundario para amigos, posts y playlists */}
      <div className="p-8">
        {friends.length === 0 ? (
          <p className="text-center text-gray-400">
            Aún no tienes amigos, prueba ir a la pestaña de comunidad para ver
            posts y hacer amigos
          </p>
        ) : (
          <Friends friends={friends} /> // Muestra la lista de amigos si existe
        )}
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-1 md:mr-8 mb-8 md:mb-0">
            <h1 className="text-2xl font-bold mb-4">Mis Posts</h1>
            {myposts.length === 0 ? (
              <p className="text-gray-400">No has hecho ningún post aún</p>
            ) : (
              // Mapea y muestra los posts del usuario
              myposts.slice(0, 10).map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  currUserName={userData.name}
                  currId={userData.id}
                />
              ))
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">Mis PlayLists</h1>
            {playlists.length === 0 ? (
              <p className="text-gray-400">No tienes playlists aún</p>
            ) : (
              // Mapea y muestra las playlists del usuario
              playlists.map((playlist) => (
                <Playlist key={playlist.id} playlist={playlist} edit={false} />
              ))
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          {/* Botón para editar el perfil */}
          <button
            onClick={() => navigate("/edit")}
            className="bg-blue-500 text-white py-2 px-4 rounded-full"
          >
            Editar Perfil
          </button>
        </div>
        {/* Muestra el mensaje de error si existe */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>
    </>
  );
};

export default Profile;
