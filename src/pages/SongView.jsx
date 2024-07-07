import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchSongs } from '../services/songs/getAllSongs';
import { searchSongsByTitle, searchSongsByGenre, searchSongsByArtistName } from '../services/songs/searchSongBy';
import Song from '../components/songs/Song';
import { getRoleBasedOnToken } from '../services/auth/getRoleToken';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from '../components/search/SearchInput';

const SongView = ({ showSearchBar }) => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [role, setRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('titulo');
    const [noResults, setNoResults] = useState(false);
    const observer = useRef();
    const navigate = useNavigate();

    const loadSongs = async (isSearch = false, resetPage = false) => {
        if (isLoading || (!hasMore && !resetPage)) return;
        setIsLoading(true);
        try {
            let res;
            if (isSearch) {
                switch (searchType) {
                    case 'titulo':
                        res = await searchSongsByTitle(searchTerm, resetPage ? 0 : page, size);
  
                        if (res.status === 200) {
                            setSongs(res.data.content);
                            setHasMore(false); 
                            setNoResults(res.data.length === 0);
                        }
                        setIsLoading(false);
                        return;
                    case 'genero':
                        res = await searchSongsByGenre(searchTerm, resetPage ? 0 : page, size);
                        break;
                    case 'artista':
                        res = await searchSongsByArtistName(searchTerm, resetPage ? 0 : page, size);
                        break;
                    default:
                        res = await fetchSongs(resetPage ? 0 : page, size);
                        break;
                }
            } else {
                res = await fetchSongs(resetPage ? 0 : page, size);
            }

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

    const lastSongElementRef = useCallback((node) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadSongs(searchTerm !== '', false);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    useEffect(() => {
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, []);

    const handleDeleteSong = (id) => {
        setSongs((prevSongs) => prevSongs.filter((song) => song.id !== id));
    };

    const handleAddSongClick = () => {
        navigate('/addsong');
    };

    const handleSearch = async () => {
        setPage(0);
        setHasMore(true);
        setSongs([]);
        await loadSongs(true, true);
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
        >
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
                        handleSearchTermChange={(e) => setSearchTerm(e.target.value)}
                        handleSearch={handleSearch}
                        searchType={searchType}
                        setSearchType={setSearchType}
                        options={[
                            { value: 'titulo', label: 'Titulo' },
                            { value: 'genero', label: 'Genero' },
                            { value: 'artista', label: 'Artista' },
                        ]}
                    />
                </motion.div>
            )}
            <div className="hide-scrollbar overflow-auto w-full max-w-5xl h-[calc(100vh-150px)]">
                {noResults && !isLoading && (
                    <p className="text-center mt-4 text-spotify-black ">No se encontraron canciones con esas características</p>
                )}
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {songs.map((song, index) => (
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
                                />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            </div>
            {isLoading && <p className="text-center mt-4">Loading...</p>}
            {!hasMore && !isLoading && songs.length > 0 && <p className="text-center mt-4 text-spotify-black">No hay más canciones</p>}
            {role === 'ROLE_ADMIN' && (
                <button
                    onClick={handleAddSongClick}
                    className="fixed bottom-16 right-5 bg-color4 text-white p-4 rounded-full shadow-lg hover:bg-color3 transition duration-300"
                    title="Agregar Canción"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            )}
        </motion.div>
    );
};

export default SongView;
