import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const MusicPlayerContext = createContext();

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};

export const MusicPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playTrackWithFade = async (url, fadeDuration = 0.2) => {
    if (audioRef.current) {
      await stopTrackWithFade(fadeDuration);
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      audio.volume = 0;
      audio.play();
      fadeIn(audio, fadeDuration);
      setCurrentTrack(audio);
    });

    audio.addEventListener('error', (e) => {
      console.error('Error playing track:', e);
    });
  };

  const stopTrackWithFade = async (fadeDuration = 0.5) => {
    if (!audioRef.current) return;
    await fadeOut(audioRef.current, fadeDuration);
    audioRef.current.pause();
    setCurrentTrack(null);
  };

  const fadeIn = (audio, duration) => {
    let volume = 0;
    const step = 1 / (duration * 10);
    const interval = setInterval(() => {
      volume += step;
      if (volume >= 1) {
        volume = 1; 
        clearInterval(interval);
      }
      audio.volume = volume;
    }, 100);
  };

  const fadeOut = (audio, duration) => {
    let volume = 1;
    const step = 1 / (duration * 10);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        volume -= step;
        if (volume <= 0) {
          volume = 0; 
          clearInterval(interval);
          resolve();
        }
        audio.volume = volume;
      }, 100);
    });
  };

  return (
    <MusicPlayerContext.Provider value={{ playTrackWithFade, stopTrackWithFade, currentTrack }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
