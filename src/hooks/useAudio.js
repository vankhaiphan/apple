import { useState, useEffect, useRef } from 'react';

export const useAudio = (src, onEnd) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      audioRef.current = new Audio(src);
      
      const audio = audioRef.current;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setHasError(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        if (onEnd) onEnd();
      });

      audio.addEventListener('error', () => {
        setHasError(true);
        setIsPlaying(false);
      });
      
      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [src, onEnd]);

  const play = () => {
    if (audioRef.current && !hasError) {
      audioRef.current.play().catch(() => {
        setHasError(true);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    isPlaying,
    duration,
    currentTime,
    play,
    pause,
    toggle,
    seek,
    hasError,
  };
};
