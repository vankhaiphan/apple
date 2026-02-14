import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';

export default function LoadingScreen() {
  const introComplete = useStore((state) => state.introComplete);

  return (
    <AnimatePresence>
      {!introComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-50 bg-gradient-to-b from-[#1b2735] to-[#090a0f] flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                {/* <span className="text-6xl md:text-8xl">🍎</span> */}
                <h1 className="text-5xl md:text-7xl font-serif text-romantic glow-text">
                  Our Love Tree
                </h1>
              </div>
              <p className="text-romantic-300 text-lg md:text-xl">
                Growing our memories...
              </p>
            </motion.div>

            {/* Animated dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-romantic-400 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
