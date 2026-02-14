import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../hooks/useStore';

export default function AmbientSound() {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMuted = useStore((state) => state.isMuted);
  const introComplete = useStore((state) => state.introComplete);
  const selectedLetter = useStore((state) => state.selectedLetter);

  useEffect(() => {
    const initAudioContext = async () => {
      if (!audioContextRef.current && introComplete) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;

          // Wait for user interaction to resume context if suspended
          if (audioContext.state === 'suspended') {
            // Will be resumed when user clicks (via selectedLetter change)
            return;
          }
        } catch (error) {
          console.log('AudioContext creation deferred until user interaction');
          return;
        }
      }
    };

    initAudioContext();
  }, [introComplete]);

  // Resume audio context and create ambience when user interacts (clicks an apple)
  useEffect(() => {
    const createAmbience = async () => {
      if (!audioContextRef.current || audioRef.current) return;

      const audioContext = audioContextRef.current;

      // Resume if suspended
      if (audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
        } catch (error) {
          console.log('Could not resume audio context:', error);
          return;
        }
      }

      // Create a soft ambient pad sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      oscillator1.frequency.setValueAtTime(110, audioContext.currentTime); // A2
      oscillator2.frequency.setValueAtTime(165, audioContext.currentTime); // E3
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator1.start();
      oscillator2.start();
      
      audioRef.current = { oscillator1, oscillator2, gainNode, audioContext };
      setIsInitialized(true);
    };

    if (selectedLetter && introComplete && !isInitialized) {
      createAmbience();
    }

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.oscillator1.stop();
          audioRef.current.oscillator2.stop();
          audioRef.current.audioContext.close();
        } catch (error) {
          // Silently handle if already stopped
        }
      }
    };
  }, [selectedLetter, introComplete, isInitialized]);

  useEffect(() => {
    if (audioRef.current) {
      const targetVolume = isMuted ? 0 : 0.02;
      audioRef.current.gainNode.gain.linearRampToValueAtTime(
        targetVolume,
        audioRef.current.audioContext.currentTime + 0.5
      );
    }
  }, [isMuted]);

  return null;
}
