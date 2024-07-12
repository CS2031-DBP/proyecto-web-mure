import React, { useState, useEffect } from 'react';
import PlayArrow from "@mui/icons-material/PlayArrow";
import Stop from "@mui/icons-material/Stop";
import Headphones from "@mui/icons-material/Headphones";
import HeadsetOff from "@mui/icons-material/HeadsetOff";
import { motion } from 'framer-motion';
import { getTrackDetailsByTitle } from '../../services/spotify/spotify'; 
import { useMusicPlayer } from '../../contexts/MusicContext'; 

const MusicPost = ({ post }) => {
  const { song, album } = post;
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDetails, setTrackDetails] = useState(null);
  const [error, setError] = useState('');
  const { playTrackWithFade, stopTrackWithFade, currentTrack } = useMusicPlayer();

  useEffect(() => {
    const fetchTrackDetails = async () => {
      if (song && song.title) {
        try {
          const details = await getTrackDetailsByTitle(song.title);
          setTrackDetails(details);
        } catch (error) {
          setError('Track not found');
          console.error('Error fetching track details:', error);
        }
      }
    };

    fetchTrackDetails();
  }, [song]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await stopTrackWithFade();
      setIsPlaying(false);
    } else {
      if (currentTrack) {
        await stopTrackWithFade();
      }
      await playTrackWithFade(trackDetails.preview_url);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack) {
      const handleEnded = () => setIsPlaying(false);
      currentTrack.addEventListener('ended', handleEnded);
      return () => currentTrack.removeEventListener('ended', handleEnded);
    }
  }, [currentTrack]);

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg shadow-sm w-full">
      {song?.coverUrl || album?.coverUrl ? (
        <motion.img
          src={song?.coverUrl || album?.coverUrl}
          alt="cover"
          className="w-24 h-auto rounded"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : (
        <div className="w-24 h-auto rounded bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between text-black">
        {song ? (
          <>
            <p className="font-semibold">Song: {song.title}</p>
            <p>Artists: {song.artistsNames?.join(', ') || "Unknown"}</p>
            <p>Genre: {song.genre}</p>
            <p>Duration: {song.duration}</p>
          </>
        ) : album ? (
          <>
            <p className="font-semibold">Album: {album.title}</p>
            <p>Artist: {album.artist}</p>
            <p>Duration: {album.duration}</p>
            <p>Songs: {album.songs?.slice(0, 3).join(", ") || "No songs available"}</p>
          </>
        ) : (
          <p className="font-semibold">Untitled</p>
        )}
      </div>
      {trackDetails?.preview_url ? (
        <button onClick={handlePlayPause}>
          {isPlaying ? (
            <Stop className="text-lg text-black" />
          ) : (
            <PlayArrow className="text-lg text-black" />
          )}
        </button>
      ) : (
        <a href={song?.link || album?.link} target="_blank" rel="noopener noreferrer">
          <Headphones className="text-lg text-black" />
        </a>
      )}
    </div>
  );
};

export default MusicPost;
