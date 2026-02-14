import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function TitleOverlay() {
  const introComplete = useStore((state) => state.introComplete);
  const isMuted = useStore((state) => state.isMuted);
  const setIsMuted = useStore((state) => state.setIsMuted);

  if (!introComplete) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2"
      >
        <h1 className="text-3xl md:text-5xl font-serif text-romantic glow-text text-center flex items-center justify-center gap-3">
          {/* <span className="text-4xl md:text-6xl">🍎</span> */}
          Our Love Tree
        </h1>
        <p className="text-romantic-300 text-center text-sm md:text-base mt-2">
          One apple, one letter, one memory at a time...
        </p>
      </motion.div>

      {/* Mute button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors pointer-events-auto"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-romantic-300" />
        ) : (
          <Volume2 className="w-5 h-5 text-romantic-300" />
        )}
      </motion.button>

      {/* Instructions hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-romantic-300 text-sm text-center"
      >
        Drag to rotate • Scroll to zoom
      </motion.div>
    </div>
  );
}
