import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchSongs } from '../services/songs/getAllSongs';
import Song from '../components/songs/Song';
import { getRoleBasedOnToken } from '../services/auth/getRoleToken';
import { useNavigate } from 'react-router-dom';

const SongView = () => {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [role, setRole] = useState(null);
    const observer = useRef();
    const navigate = useNavigate();

    const loadSongs = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const res = await fetchSongs(page, size);
            if (res.status === 200) {
                setSongs((prevSongs) => [...prevSongs, ...res.data.content]);
                setPage((prevPage) => prevPage + 1);
                if (res.data.content.length === 0) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error(error);
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
                loadSongs();
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

    return (
        <div className="flex flex-col items-center justify-center ">
            <h1 className="text-3xl font-bold text-center mb-6 text-black">Songs</h1>
            <div className="flex justify-center mb-4">
                {role === 'ROLE_ADMIN' && (
                    <button className="bg-green-500 text-white px-4 py-2 rounded ml-2" onClick={handleAddSongClick}>Agregar Canción</button>
                )}
            </div>
            <div className="hide-scrollbar overflow-auto w-full max-w-5xl h-[calc(100vh-150px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {songs.map((song, index) => {
                        if (songs.length === index + 1) {
                            return <Song ref={lastSongElementRef} key={song.id} song={song} role={role} onDelete={handleDeleteSong} />;
                        } else {
                            return <Song key={song.id} song={song} role={role} onDelete={handleDeleteSong} />;
                        }
                    })}
                </div>
            </div>
            {isLoading && <p className="text-center mt-4">Loading...</p>}
            {!hasMore && <p className="text-center mt-4">No more songs</p>}
        </div>
    );
};

export default SongView;
