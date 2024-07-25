import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchSongs } from "../services/songs/getAllSongs";
import { searchSongsByArtistName } from "../services/songs/searchSongByArtistName";
import { searchSongsByTitle } from "../services/songs/searchSongByTitle";
import { searchSongsByGenre } from "../services/songs/searchSongByGenre";
import Song from "../components/songs/Song";
import { getRoleBasedOnToken } from "../services/auth/getRoleToken";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchInputSel from "../components/search/SearchInputSel";
import { useMusicPlayer } from "../contexts/MusicContext";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const SongView = ({ showSearchBar }) => {
  const [songs, setSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("titulo");
  const [noResults, setNoResults] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { volume, changeVolume } = useMusicPlayer();
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const fetchData = async (resetPage = false) => {
    try {
      let results;
      const currentPage = resetPage ? 0 : page;
      switch (searchType) {
        case "titulo":
          results = await searchSongsByTitle(searchTerm, currentPage, size);
          break;
        case "genero":
          results = await searchSongsByGenre(searchTerm, currentPage, size);
          break;
        case "artista":
          results = await searchSongsByArtistName(
            searchTerm,
            currentPage,
            size
          );
          break;
        default:
          results = { data: { content: [] } };
      }
      const fetchedData = results.data.content;
      setSearchResults((prevResults) =>
        resetPage ? fetchedData : [...prevResults, ...fetchedData]
      );
      setPage((prevPage) => (resetPage ? 1 : prevPage + 1));
      setHasMore(fetchedData.length === size);
      setNoResults(fetchedData.length === 0 && currentPage === 0);
    } catch (error) {
      setError("Error fetching data.");
    }
  };

  const loadSongs = async (resetPage = false) => {
    if (isLoading || (!hasMore && !resetPage)) return;
    setIsLoading(true);
    try {
      const currentPage = resetPage ? 0 : page;
      const res = await fetchSongs(currentPage, size);
      if (res.status === 200) {
        const fetchedData = res.data.content;
        setSongs((prevSongs) =>
          resetPage ? fetchedData : [...prevSongs, ...fetchedData]
        );
        setPage((prevPage) => (resetPage ? 1 : prevPage + 1));
        setHasMore(fetchedData.length === size);
        setNoResults(fetchedData.length === 0 && currentPage === 0);
      }
    } catch (error) {
      setError("Error loading songs.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSongs();
    const role = getRoleBasedOnToken();
    setRole(role);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const lastSongElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (searchResults.length > 0) {
            fetchData();
          } else {
            loadSongs();
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, searchResults]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const handleDeleteSong = (id) => {
    setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    setSearchResults((prevResults) =>
      prevResults.filter((song) => song.id !== id)
    );
  };

  const handleAddSongClick = () => {
    navigate("/addsong");
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setHasMore(true);
    setSearchResults([]);
    fetchData(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-6">
      {showSearchBar && (
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <SearchInputSel
            searchTerm={searchTerm}
            handleSearchTermChange={handleSearchTermChange}
            handleSearch={handleSearch}
            searchType={searchType}
            setSearchType={setSearchType}
            options={[
              { value: "titulo", label: "Titulo" },
              { value: "genero", label: "Genero" },
              { value: "artista", label: "Artista" },
            ]}
          />
        </motion.div>
      )}
      <div className="hide-scrollbar overflow-auto w-full max-w-5xl flex-1">
        {noResults && !isLoading && (
          <p className="text-center mt-4 text-spotify-black ">
            No songs found with those characteristics
          </p>
        )}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {searchResults.length > 0
              ? searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Song
                      ref={
                        searchResults.length === index + 1
                          ? lastSongElementRef
                          : null
                      }
                      song={result}
                      role={role}
                      onDelete={handleDeleteSong}
                      className="h-full"
                    />
                  </motion.div>
                ))
              : songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Song
                      ref={
                        songs.length === index + 1 ? lastSongElementRef : null
                      }
                      song={song}
                      role={role}
                      onDelete={handleDeleteSong}
                      className="h-full"
                    />
                  </motion.div>
                ))}
          </div>
        </AnimatePresence>
      </div>
      <motion.button
        onClick={() => setShowVolumeControl(!showVolumeControl)}
        className="fixed bottom-5 left-5 bg-buttonColor text-white p-4 rounded-full shadow-lg hover:bg-buttonHover transition duration-300"
        title="Volume Control"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, scale: 0.5 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 },
        }}
        transition={{ duration: 0.3 }}
      >
        <VolumeUpIcon className="text-2xl" />
      </motion.button>
      {showVolumeControl && (
        <motion.div
          className="fixed left-5 bottom-24 bg-white p-2 rounded-lg shadow-lg w-40"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
          }}
          transition={{ duration: 0.3 }}
        >
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(e.target.value)}
            className="w-full"
          />
        </motion.div>
      )}
      {isLoading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && !isLoading && songs.length > 0 && (
        <p className="text-center mt-4 text-spotify-black">
          No more songs available
        </p>
      )}
      {role === "ROLE_ADMIN" && (
        <button
          onClick={handleAddSongClick}
          className="fixed bottom-4 right-4 bg-buttonColor text-white p-3 rounded-full shadow-lg hover:bg-color3 transition duration-300"
          title="Add Song"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SongView;
