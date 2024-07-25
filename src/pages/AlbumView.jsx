import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../services/album/getAlbumById';
import { likeAlbum } from '../services/album/likeAlbum';
import { dislikeAlbum } from '../services/album/dislikeAlbum';
import { isAlbumLikedByUser } from '../services/album/isAlbumLikedByUser';
import { searchSongById } from '../services/songs/searchSongById';
import { fetchCurrentUser } from '../services/profile/getUserInfo';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Stop from '@mui/icons-material/Stop';
import Headphones from '@mui/icons-material/Headphones';
import { motion } from 'framer-motion';
import spotifyIcon from '../assets/spotifyIcon.svg'; 

const AlbumView = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [liked, setLiked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [playingTrack, setPlayingTrack] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const userData = await fetchCurrentUser();
                setUserId(userData.data.id);

                const albumData = await getAlbumById(albumId);
                setAlbum(albumData.data);

                const likedStatus = await isAlbumLikedByUser(albumId, userData.data.id);
                setLiked(likedStatus.data);

                if (albumData.data.songsIds) {
                    const songDetails = await Promise.all(
                        albumData.data.songsIds.map(async (songId) => {
                            const songDetail = await searchSongById(songId);
                            return songDetail.data;
                        })
                    );
                    setSongs(songDetails);
                }
            } catch (err) {
                setError(`Failed to load album data: ${err.message}`);
            }
        };

        fetchAlbumData();
    }, [albumId]);

    const handleLike = async () => {
        try {
            if (liked) {
                await dislikeAlbum(albumId);
            } else {
                await likeAlbum(albumId);
            }
            setLiked(!liked);
        } catch (err) {
            setError(`Failed to update like status: ${err.message}`);
        }
    };

    const openLink = (link) => {
        window.open(link, '_blank');
    };

    const handlePlayPause = async (song) => {
        if (playingTrack?.id === song.id) {
            playingTrack.audio.pause();
            setPlayingTrack(null);
        } else {
            if (playingTrack) {
                playingTrack.audio.pause();
            }
            const audio = new Audio(song.spotifyPreviewUrl);
            setPlayingTrack({ id: song.id, audio });
            audio.play();
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <motion.p className="text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    {error}
                </motion.p>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    Loading...
                </motion.p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white max-w-screen-md mt-10 mb-5">
            <motion.button 
                onClick={() => navigate(-1)} 
                className="text-white bg-textPrimary p-2 rounded-full fixed top-24 left-4 shadow-lg hover:bg-buttonHover transition duration-300"  // Cambiado top-4 a top-16
                initial={{ opacity: 0, y: -70 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                <ArrowBackIcon fontSize="large" />
            </motion.button>
            <motion.div 
                className="flex items-center mt-4 text-black"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                <img src={album.coverImageUrl} alt={album.title} className="w-48 h-48 rounded-lg shadow-md" />
                <div className="ml-6">
                    <h1 className="text-3xl font-bold">{album.title}</h1>
                    <p className="text-lg text-gray-600">by {album.artistName}</p>
                    <div className="mt-2">
                        <p>{album.songsCount} songs</p>
                        <p>Total Duration: {album.totalDuration}</p>
                        <p>Release Date: {album.releaseDate}</p>
                    </div>
                    <div className="flex items-center mt-4 space-x-4">
                        <button onClick={handleLike}>
                            {liked ? <Favorite className="text-red-500" /> : <FavoriteBorder />}
                        </button>
                        <button onClick={() => openLink(album.spotifyUrl)}>
                            <img src={spotifyIcon} alt="Spotify" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="mt-6"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
            >
                {songs.map((song) => (
                    <motion.div 
                        key={song.id} 
                        className="p-4 bg-white rounded-lg shadow-md flex items-center space-x-4 mb-4 text-black"
                        whileHover={{ scale: 1.02 }}
                    >
                        {song.coverImageUrl ? (
                            <img
                                src={song.coverImageUrl}
                                alt="Cover"
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-lg bg-gray-200"></div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-bold text-xl">{song.title}</h3>
                            <p className="text-gray-600">{song.artistsNames ? song.artistsNames.join(", ") : "Unknown"}</p>
                            <p className="text-gray-600">{song.albumTitle}</p>
                            <p className="text-gray-600">{song.genre}</p>
                            <p className="text-gray-600">{song.duration}</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            {song.spotifyPreviewUrl ? (
                                <button onClick={() => handlePlayPause(song)}>
                                    {playingTrack?.id === song.id ? (
                                        <Stop className="text-buttonColor" />
                                    ) : (
                                        <PlayArrow className="text-buttonColor" />
                                    )}
                                </button>
                            ) : (
                                <a href={song.spotifyUrl} target="_blank" rel="noopener noreferrer">
                                    <Headphones className="text-buttonColor" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default AlbumView;
