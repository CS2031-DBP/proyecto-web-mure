import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMyPlaylists } from "../services/playlists/getMyPlaylists";
import { getUserPlaylists } from "../services/playlists/getPlaylistsByUserId";
import PlaylistItem from "../components/playlist/PlaylistItem";
import { fetchCurrentUser } from "../services/profile/getUserInfo";
import { getUserById } from "../services/profile/getUserById";
import { motion } from "framer-motion";
import PlaylistAdd from "@mui/icons-material/PlaylistAdd";

const UserPlaylistsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [errors, setErrors] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [fetchedFromMyPlaylists, setFetchedFromMyPlaylists] = useState(false);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const currentUserResponse = await fetchCurrentUser();
        setCurrentUser(currentUserResponse.data);

        let playlistsData;
        if (!id || id == currentUserResponse.data.id) {
          playlistsData = await fetchMyPlaylists(page, size);
          setOwner(currentUserResponse.data);
          setFetchedFromMyPlaylists(true);

        } else {
          playlistsData = await getUserPlaylists(id, page, size);
          const ownerResponse = await getUserById(id);
          setOwner(ownerResponse.data);
        }

        setPlaylists(playlistsData.data.content || playlistsData.data);
      } catch (error) {
        console.error("Error loading playlists:", error);
        setErrors("Failed to load playlists");
      }
    };

    loadPlaylists();
  }, [id, page, size]);


  return (
    <div className="container mx-auto py-8">
      {errors && (
        <motion.p
          className="text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {errors}
        </motion.p>
      )}
      <h1 className="text-3xl font-bold mb-6 text-black">
        {fetchedFromMyPlaylists ? "My Playlists" : `${owner?.name}'s Playlists`}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <PlaylistItem key={playlist.id} playlist={playlist} index={index} />
          ))
        ) : (
          <motion.p
            className="col-span-full text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No playlists found. Try creating one!
          </motion.p>
        )}
      </div>
      { fetchedFromMyPlaylists && (
        <motion.button
          onClick={() => navigate("/playlist/create")}
          className="fixed bottom-5 right-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
          title="Create Playlist"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PlaylistAdd className="text-2xl" />
        </motion.button>
      )}
    </div>
  );
};

export default UserPlaylistsPage;
