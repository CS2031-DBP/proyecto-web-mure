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
  const [size] = useState(6);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [fetchedFromMyPlaylists, setFetchedFromMyPlaylists] = useState(false);

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
      setHasMore(playlistsData.data.content ? playlistsData.data.content.length === size : playlistsData.data.length === size);
      setLoading(false);
    } catch (error) {
      console.error("Error loading playlists:", error);
      setErrors("Failed to load playlists");
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [id, page, size]);

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleNavigateToPlaylist = (playlistId) => {
    localStorage.setItem("fetchedFromMyPlaylists", fetchedFromMyPlaylists);
    navigate(`/playlist/${playlistId}`);
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" style={{ height: '450px' }}>
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div key={playlist.id} onClick={() => handleNavigateToPlaylist(playlist.id)}>
              <PlaylistItem playlist={playlist} index={index} />
            </div>
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
      <div className="flex justify-between mt-12">
        {page > 0 && (
          <button
            onClick={handlePreviousPage}
            className="bg-buttonColor text-white px-4 py-2 rounded-lg shadow-lg hover:bg-buttonHover transition duration-300"
          >
            &larr; Previous
          </button>
        )}
        <div className="flex-grow"></div>
        {hasMore && (
          <button
            onClick={handleNextPage}
            className="bg-buttonColor text-white px-4 py-2 rounded-lg shadow-lg hover:bg-buttonHover transition duration-300"
          >
            Next &rarr;
          </button>
        )}
      </div>
      {fetchedFromMyPlaylists && (
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
