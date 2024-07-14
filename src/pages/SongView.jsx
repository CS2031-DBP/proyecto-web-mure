import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchSongs } from '../services/songs/getAllSongs';
import { searchSongsByTitle, searchSongsByGenre, searchSongsByArtistName } from '../services/songs/searchSongBy';
import Song from '../components/songs/Song';
import { getRoleBasedOnToken } from '../services/auth/getRoleToken';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from '../components/search/SearchInput';

const SongView = ({ showSearchBar }) => {
    const [songs, setSongs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(9);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [role, setRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [noResults, setNoResults] = useState(false);
    const observer = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchData = async () => {
        try {
            const titleResults = await searchSongsByTitle(searchTerm, page, size);
            console.log("Title results:");
            console.log(titleResults);
            const genreResults = await searchSongsByGenre(searchTerm, page, size);
            console.log("Genre results:");
            console.log(genreResults);
            const artistResults = await searchSongsByArtistName(searchTerm, page, size);
            console.log("Artist results:");
            console.log(artistResults);

            setSearchResults([
                ...titleResults.data.content.map(song => ({ ...song, type: 'song' })),
                ...genreResults.data.content.map(song => ({ ...song, type: 'song' })),
                ...artistResults.data.content.map(song => ({ ...song, type: 'song' }))
            ]);
            setNoResults(searchResults.length === 0);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const loadSongs = async (resetPage = false) => {
        if (isLoading || (!hasMore && !resetPage)) return;
        setIsLoading(true);
        try {
            const res = await fetchSongs(resetPage ? 0 : page, size);
            if (res.status === 200) {
                const newSongs = resetPage ? res.data.content : [...songs, ...res.data.content];
                setSongs(newSongs);
                setPage(resetPage ? 1 : page + 1);
                setHasMore(res.data.content.length === size);
                setNoResults(newSongs.length === 0);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSongs([]);
                setHasMore(false);
                setNoResults(true);
            } else {
                console.error(error);
            }
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

    const lastSongElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadSongs(false);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (searchTerm.length > 2) {
            fetchData();
        } else if (searchTerm.length === 0) {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleDeleteSong = (id) => {
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    };

    const handleAddSongClick = () => {
        navigate('/addsong');
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
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
                    <SearchInput
                        searchTerm={searchTerm}
                        handleSearchTermChange={handleSearchTermChange}
                    />
                </motion.div>
            )}
            <div className="hide-scrollbar overflow-auto w-full max-w-5xl flex-1">
                {noResults && !isLoading && (
                    <p className="text-center mt-4 text-spotify-black ">No se encontraron canciones con esas características</p>
                )}
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {searchTerm.length > 2 ? (
                            searchResults.map((result, index) => (
                                <motion.div
                                    key={result.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Song
                                        ref={searchResults.length === index + 1 ? lastSongElementRef : null}
                                        key={result.id}
                                        song={result}
                                        role={role}
                                        onDelete={handleDeleteSong}
                                        className="h-full"
                                    />
                                </motion.div>
                            ))
                        ) : (
                            songs.map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Song
                                        ref={songs.length === index + 1 ? lastSongElementRef : null}
                                        key={song.id}
                                        song={song}
                                        role={role}
                                        onDelete={handleDeleteSong}
                                        className="h-full"
                                    />
                                </motion.div>
                            ))
                        )}
                    </div>
                </AnimatePresence>
            </div>
            {isLoading && <p className="text-center mt-4">Loading...</p>}
            {!hasMore && !isLoading && songs.length > 0 && <p className="text-center mt-4 text-spotify-black">No hay más canciones</p>}
            {role === 'ROLE_ADMIN' && (
                <button
                    onClick={handleAddSongClick}
                    className="fixed bottom-4 right-4 bg-buttonColor text-white p-3 rounded-full shadow-lg hover:bg-color3 transition duration-300"
                    title="Agregar Canción"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SongView;
