import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchSongs } from '../services/songs/getAllSongs';
import { getSongsByGenre } from '../services/songs/getSongsByGenre';
import { getSongsByArtistName } from '../services/songs/getSongsByArtistName';
import { getSongsByAlbumId } from '../services/songs/getSongsByAlbumId';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState(''); // genre, artistName, albumId
    const observer = useRef();
    const navigate = useNavigate();

    const loadSongs = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            let res;
            if (searchType === 'genre') {
                res = await getSongsByGenre(searchTerm);
            } else if (searchType === 'artistName') {
                res = await getSongsByArtistName(searchTerm);
            } else if (searchType === 'albumId') {
                res = await getSongsByAlbumId(searchTerm);
            } else {
                res = await fetchSongs(page, size);
            }

            if (res.status === 200) {
                const songData = res.data.content || res.data;
                setSongs((prevSongs) => [...prevSongs, ...songData]);
                setPage((prevPage) => prevPage + 1);
                if (songData.length === 0) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (searchType && searchTerm) {
            setPage(0);
            setSongs([]);
            setHasMore(true);
            loadSongs();
        }
    }, [searchType, searchTerm]);

    useEffect(() => {
        if (!searchType && !searchTerm) {
            loadSongs();
        }
        const role = getRoleBasedOnToken();
        setRole(role);
    }, [searchType, searchTerm]);

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setPage(0);
        setSongs([]);
        setHasMore(true);
        loadSongs();
    };

    return (
        <div>
            <h1>Songs</h1>
            <button onClick={() => navigate('/dashboard')}>Menu</button>
            {role === 'ROLE_ADMIN' && <button onClick={handleAddSongClick}>Agregar Canción</button>}

            <form onSubmit={handleSearch}>
                <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="">Select search type</option>
                    <option value="genre">Genre</option>
                    <option value="artistName">Artist Name</option>
                    <option value="albumId">Album ID</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term"
                />
                <button type="submit">Search</button>
            </form>

            <ul>
                {songs.map((song, index) => {
                    if (songs.length === index + 1) {
                        return <Song ref={lastSongElementRef} key={song.id} song={song} role={role} onDelete={handleDeleteSong} />;
                    } else {
                        return <Song key={song.id} song={song} role={role} onDelete={handleDeleteSong} />;
                    }
                })}
            </ul>
            {isLoading && <p>Loading...</p>}
            {!hasMore && <p>No more songs</p>}
        </div>
    );
};

export default SongView;
