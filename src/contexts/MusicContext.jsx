import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};

export const MusicPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.35);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = async (url) => {
    if (audioRef.current) {
      stopTrack();
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.volume = volume;

    audio.addEventListener('canplaythrough', () => {
      audio.play();
      setCurrentTrack(audio);
    });

    audio.addEventListener('error', (e) => {
      console.error('Error playing track:', e);
    });
  };

  const stopTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setCurrentTrack(null);
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <MusicPlayerContext.Provider value={{ playTrack, stopTrack, currentTrack, volume, changeVolume }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
