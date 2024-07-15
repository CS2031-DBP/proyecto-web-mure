import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlayArrow from '@mui/icons-material/PlayArrow';

const PlaylistItem = ({ playlist, index }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  return (
    <motion.div 
      className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center space-y-4 text-black"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {playlist.coverImageUrl ? (
        <img
          src={playlist.coverImageUrl}
          alt={playlist.name}
          className="w-32 h-32 rounded-lg object-cover"
        />
      ) : (
        <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
          <PlayArrow fontSize="large" />
        </div>
      )}
      <h3 className="font-bold text-xl">{playlist.name}</h3>
      <p className="text-gray-600">{playlist.songsCount} songs</p>
      <button
        className="bg-buttonColor text-white px-4 py-2 rounded-lg"
        onClick={handleNavigate}
      >
        View
      </button>
    </motion.div>
  );
};

export default PlaylistItem;
