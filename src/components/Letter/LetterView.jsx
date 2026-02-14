import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../hooks/useStore';
import { useAudio } from '../../hooks/useAudio';
import AudioControls from './AudioControls';
import { X } from 'lucide-react';

// AAA-quality apple colors based on branch type
const APPLE_COLORS = {
  memories: { base: '#c92a2a', glow: '#ff6b6b', inner: '#ffcccc' },
  admiration: { base: '#e67700', glow: '#ffc078', inner: '#ffe4cc' },
  gratitude: { base: '#d4a000', glow: '#ffe066', inner: '#fff8cc' },
  dreams: { base: '#37b24d', glow: '#8ce99a', inner: '#ccffcc' },
  unsaid: { base: '#be4bdb', glow: '#e599f7', inner: '#f0ccff' },
};

// Generate lightning crack path - organic and irregular
const generateLightningPath = (startY, endY, segments = 8) => {
  const points = [];
  let currentX = 0;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = startY + (endY - startY) * t;
    
    if (i === 0 || i === segments) {
      points.push({ x: 0, y });
    } else {
      // Irregular zigzag with varying amplitude
      const amplitude = 15 + Math.random() * 25;
      const direction = i % 2 === 0 ? 1 : -1;
      currentX += direction * amplitude * (0.5 + Math.random() * 0.5);
      // Add some randomness to prevent too regular pattern
      currentX += (Math.random() - 0.5) * 10;
      points.push({ x: currentX, y });
    }
  }
  
  return points;
};

// Convert points to SVG path
const pointsToPath = (points) => {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    // Use quadratic curves for smoother lightning
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path += ` Q ${prev.x} ${midY} ${midX} ${midY}`;
    path += ` T ${curr.x} ${curr.y}`;
  }
  
  return path;
};

export default function LetterView() {
  const selectedLetter = useStore((state) => state.selectedLetter);
  const setSelectedLetter = useStore((state) => state.setSelectedLetter);
  const [animationStage, setAnimationStage] = useState('none');
  // Stages: none → apple → crack → envelope → envelopeOpen → letter
  
  const [lightningPath, setLightningPath] = useState('');
  const [crackBranches, setCrackBranches] = useState([]);
  const audioStarted = useRef(false);
  const letterTimeoutRef = useRef(null);
  const audioTimeoutRef = useRef(null);

  const audio = useAudio(selectedLetter?.audioFile);

  // Handle envelope click - user must click to open
  const handleEnvelopeClick = () => {
    if (animationStage !== 'envelope') return;
    
    // Open the envelope
    setAnimationStage('envelopeOpen');
    
    // Letter appears after envelope opens (0.9s animation + small delay)
    letterTimeoutRef.current = setTimeout(() => {
      setAnimationStage('letter');
      
      // Audio plays 3 seconds after letter becomes visible
      audioTimeoutRef.current = setTimeout(() => {
        if (audio && typeof audio.play === 'function' && !audioStarted.current) {
          audioStarted.current = true;
          try {
            const playPromise = audio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(() => {});
            }
          } catch (error) {}
        }
      }, 3000);
    }, 1000);
  };

  useEffect(() => {
    if (selectedLetter) {
      audioStarted.current = false;
      
      // Generate lightning crack paths
      const mainPath = generateLightningPath(-60, 60, 10);
      setLightningPath(pointsToPath(mainPath));
      
      // Generate branch cracks
      const branches = [];
      for (let i = 0; i < 4; i++) {
        const startPoint = mainPath[2 + Math.floor(Math.random() * 6)];
        const branchLength = 20 + Math.random() * 30;
        const angle = (Math.random() - 0.5) * Math.PI * 0.6;
        const endX = startPoint.x + Math.cos(angle) * branchLength * (startPoint.x > 0 ? 1 : -1);
        const endY = startPoint.y + Math.sin(angle) * branchLength * 0.5;
        branches.push({
          path: `M ${startPoint.x} ${startPoint.y} Q ${(startPoint.x + endX) / 2 + (Math.random() - 0.5) * 15} ${(startPoint.y + endY) / 2} ${endX} ${endY}`,
          delay: 0.1 + i * 0.05,
        });
      }
      setCrackBranches(branches);

      // Animation sequence timing - stops at envelope, waits for user click
      setAnimationStage('apple');
      
      // Apple lands and cracks
      const t1 = setTimeout(() => setAnimationStage('crack'), 900);
      
      // Envelope emerges from crack - STOPS HERE, user must click to continue
      const t2 = setTimeout(() => setAnimationStage('envelope'), 1800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current);
        if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
      };
    }
  }, [selectedLetter]);

  const handleClose = () => {
    if (audio && audio.pause) {
      audio.pause();
    }
    if (letterTimeoutRef.current) clearTimeout(letterTimeoutRef.current);
    if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    setAnimationStage('none');
    setTimeout(() => setSelectedLetter(null), 300);
  };

  if (!selectedLetter) return null;

  const colors = APPLE_COLORS[selectedLetter.branch] || APPLE_COLORS.memories;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {animationStage !== 'none' && (
          <>
            {/* Cinematic backdrop with vignette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-auto"
              onClick={animationStage === 'letter' ? handleClose : undefined}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 100%)',
                backdropFilter: 'blur(12px)',
              }}
            />

            {/* Cancel button - visible before letter appears */}
            {animationStage !== 'letter' && animationStage !== 'none' && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleClose}
                className="absolute top-6 right-6 z-50 pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <X className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-white/70 group-hover:text-white text-sm transition-colors">Cancel</span>
              </motion.button>
            )}

            {/* ========== STAGE 1 & 2: APPLE FALLS & LIGHTNING CRACK ========== */}
            {(animationStage === 'apple' || animationStage === 'crack') && (
              <div className="relative pointer-events-none">
                {/* Apple falling and landing */}
                <motion.div
                  initial={{ y: -150, scale: 0.8, opacity: 0 }}
                  animate={{ 
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    rotate: [0, -5, 3, -2, 0], // Subtle wobble during fall
                  }}
                  transition={{ 
                    duration: 0.85,
                    ease: [0.34, 1.2, 0.64, 1],
                    rotate: { duration: 0.85, times: [0, 0.3, 0.6, 0.8, 1] }
                  }}
                  className="relative"
                  style={{ width: '140px', height: '140px' }}
                >
                  {/* Intact Apple - AAA quality with depth */}
                  <motion.div
                    animate={animationStage === 'crack' ? { 
                      opacity: 0,
                      scale: 0.95,
                    } : {}}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="absolute inset-0"
                    style={{
                      borderRadius: '45% 45% 50% 50%',
                      background: `
                        radial-gradient(ellipse 70% 60% at 35% 30%, ${colors.glow}40 0%, transparent 50%),
                        radial-gradient(ellipse 100% 100% at 50% 55%, ${colors.base} 0%, ${colors.base}dd 70%, ${colors.base}aa 100%)
                      `,
                      boxShadow: `
                        0 15px 50px ${colors.base}55,
                        inset -12px -12px 25px rgba(0,0,0,0.35),
                        inset 8px 8px 20px ${colors.glow}30
                      `,
                    }}
                  >
                    {/* Primary highlight */}
                    <div 
                      className="absolute top-5 left-5 w-10 h-12 rounded-full blur-sm"
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                    />
                    {/* Secondary highlight */}
                    <div 
                      className="absolute top-8 left-9 w-4 h-5 rounded-full blur-[2px]"
                      style={{ background: 'rgba(255,255,255,0.7)' }}
                    />
                    {/* Stem */}
                    <div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-2.5 h-7 rounded-t-full"
                      style={{
                        background: 'linear-gradient(to right, #3d2815 0%, #5a4025 50%, #3d2815 100%)',
                        transform: 'translateX(-50%) rotate(-8deg)',
                      }}
                    />
                    {/* Leaf */}
                    <div 
                      className="absolute -top-1 left-[55%] w-6 h-4 origin-bottom-left"
                      style={{
                        background: 'linear-gradient(135deg, #4a8520 0%, #3d6b18 100%)',
                        borderRadius: '0% 80% 0% 80%',
                        transform: 'rotate(-15deg)',
                      }}
                    />
                  </motion.div>

                  {/* ========== LIGHTNING CRACK EFFECT ========== */}
                  {animationStage === 'crack' && (
                    <>
                      {/* Impact flash */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Main lightning crack SVG */}
                      <motion.svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="-70 -70 140 140"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {/* Glow layer */}
                        <motion.path
                          d={lightningPath}
                          fill="none"
                          stroke={colors.glow}
                          strokeWidth="12"
                          strokeLinecap="round"
                          filter="blur(8px)"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ duration: 0.4, delay: 0.25 }}
                        />
                        {/* Main crack line */}
                        <motion.path
                          d={lightningPath}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
                        />
                        {/* Inner bright line */}
                        <motion.path
                          d={lightningPath}
                          fill="none"
                          stroke="#fffef0"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.35, delay: 0.28 }}
                        />
                        
                        {/* Branch cracks */}
                        {crackBranches.map((branch, i) => (
                          <motion.path
                            key={i}
                            d={branch.path}
                            fill="none"
                            stroke="rgba(255,255,255,0.7)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.25, delay: 0.35 + branch.delay }}
                          />
                        ))}
                      </motion.svg>

                      {/* Crack particles - light dust */}
                      {[...Array(16)].map((_, i) => (
                        <motion.div
                          key={`dust-${i}`}
                          className="absolute top-1/2 left-1/2 rounded-full"
                          style={{
                            width: 2 + Math.random() * 4,
                            height: 2 + Math.random() * 4,
                            background: i % 2 === 0 ? colors.inner : '#ffffff',
                          }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: (Math.random() - 0.5) * 120,
                            y: (Math.random() - 0.5) * 120,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{
                            duration: 0.8 + Math.random() * 0.4,
                            delay: 0.3 + Math.random() * 0.2,
                            ease: 'easeOut',
                          }}
                        />
                      ))}

                      {/* Apple halves separating with organic crack edge */}
                      <motion.div
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                        animate={{ x: -55, y: 15, rotate: -18, opacity: 1 }}
                        transition={{ duration: 0.65, delay: 0.45, ease: [0.22, 1.2, 0.36, 1] }}
                        className="absolute inset-0"
                        style={{ width: '75px', height: '140px' }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            borderRadius: '45% 5% 5% 50%',
                            background: `
                              radial-gradient(ellipse at 30% 40%, ${colors.glow}30 0%, transparent 50%),
                              linear-gradient(to right, ${colors.base} 0%, ${colors.inner}90 95%, ${colors.inner} 100%)
                            `,
                            boxShadow: `
                              0 8px 25px ${colors.base}44,
                              inset -6px -6px 15px rgba(0,0,0,0.3)
                            `,
                          }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                        animate={{ x: 55, y: 15, rotate: 18, opacity: 1 }}
                        transition={{ duration: 0.65, delay: 0.45, ease: [0.22, 1.2, 0.36, 1] }}
                        className="absolute inset-0 left-[65px]"
                        style={{ width: '75px', height: '140px' }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            borderRadius: '5% 45% 50% 5%',
                            background: `
                              radial-gradient(ellipse at 70% 40%, ${colors.glow}30 0%, transparent 50%),
                              linear-gradient(to left, ${colors.base} 0%, ${colors.inner}90 95%, ${colors.inner} 100%)
                            `,
                            boxShadow: `
                              0 8px 25px ${colors.base}44,
                              inset 6px -6px 15px rgba(0,0,0,0.3)
                            `,
                          }}
                        />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>
            )}

            {/* ========== STAGE 3 & 4: PREMIUM ENVELOPE ========== */}
            {(animationStage === 'envelope' || animationStage === 'envelopeOpen') && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.34, 1.3, 0.64, 1] }}
                className="relative pointer-events-auto"
                onClick={handleEnvelopeClick}
                style={{ cursor: animationStage === 'envelope' ? 'pointer' : 'default' }}
              >
                {/* Click hint for envelope */}
                {animationStage === 'envelope' && (
                  <motion.div
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/80 text-sm whitespace-nowrap"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Click to open
                    </motion.span>
                  </motion.div>
                )}
                <div 
                  className="relative"
                  style={{ 
                    width: '340px', 
                    height: '220px',
                    perspective: '1200px',
                  }}
                >
                  {/* Envelope body - premium off-white paper */}
                  <div 
                    className="absolute inset-0 rounded-lg overflow-hidden"
                    style={{
                      background: `
                        linear-gradient(180deg, 
                          #fefdfb 0%, 
                          #faf9f6 30%, 
                          #f5f3ef 70%, 
                          #f0ede8 100%
                        )
                      `,
                      boxShadow: `
                        0 25px 60px rgba(0,0,0,0.25),
                        0 10px 25px rgba(0,0,0,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.8)
                      `,
                    }}
                  >
                    {/* Paper fiber texture overlay */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    
                    {/* Inner shadow for depth */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        boxShadow: 'inset 0 -30px 40px rgba(0,0,0,0.06)',
                      }}
                    />
                    
                    {/* Envelope fold line (bottom V) */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-24 opacity-15"
                      style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.12) 0%, transparent 100%)',
                        clipPath: 'polygon(0 100%, 50% 30%, 100% 100%)',
                      }}
                    />
                  </div>
                  
                  {/* Envelope flap - static triangular flap */}
                  <div
                    className="absolute left-0 right-0"
                    style={{
                      top: '0px',
                      height: '130px',
                      zIndex: animationStage === 'envelopeOpen' ? 0 : 10,
                      opacity: animationStage === 'envelopeOpen' ? 0 : 1,
                      transition: 'opacity 0.05s ease',
                    }}
                  >
                    {/* Flap front face - triangular flap pointing down */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `
                          linear-gradient(180deg,
                            #f8f6f2 0%,
                            #f2efe9 40%,
                            #ebe7e0 100%
                          )
                        `,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      }}
                    >
                      {/* Flap texture */}
                      <div 
                        className="absolute inset-0 opacity-15"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Wax seal */}
                  <motion.div
                    className="absolute z-20"
                    style={{
                      top: '85px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '70px',
                      height: '70px',
                    }}
                    animate={animationStage === 'envelopeOpen' ? {
                      scale: 0,
                      opacity: 0,
                      rotate: 180,
                    } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center"
                      style={{
                        background: `
                          radial-gradient(circle at 35% 35%, 
                            ${colors.glow} 0%, 
                            ${colors.base} 40%, 
                            ${colors.base}dd 100%
                          )
                        `,
                        boxShadow: `
                          0 6px 20px ${colors.base}66,
                          inset -4px -4px 12px rgba(0,0,0,0.3),
                          inset 3px 3px 8px ${colors.glow}40
                        `,
                      }}
                    >
                      <span className="text-2xl drop-shadow-lg">💕</span>
                    </div>
                  </motion.div>

                  {/* Subtle edge highlight */}
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* ========== STAGE 5: AAA QUALITY LETTER ========== */}
            {animationStage === 'letter' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.9,
                  ease: [0.34, 1.4, 0.64, 1],
                }}
                className="relative max-w-2xl w-full mx-4 pointer-events-auto"
                style={{ maxHeight: '85vh' }}
              >
                {/* Premium stationery paper with realistic letter appearance */}
                <div 
                  className="relative rounded-xl overflow-hidden flex flex-col"
                  style={{
                    maxHeight: '85vh',
                    background: `
                      linear-gradient(175deg,
                        #fefdfb 0%,
                        #fcfbf8 15%,
                        #f9f7f3 40%,
                        #f5f3ef 70%,
                        #f1eeea 100%
                      )
                    `,
                    boxShadow: `
                      0 35px 90px rgba(0,0,0,0.28),
                      0 18px 40px rgba(0,0,0,0.18),
                      0 6px 18px rgba(0,0,0,0.12),
                      inset 0 1px 0 rgba(255,255,255,0.9)
                    `,
                  }}
                >
                  {/* Paper texture overlay - fine grain */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.03' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Subtle paper edge shadow */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 60px rgba(0,0,0,0.03)',
                    }}
                  />
                  
                  {/* Elegant top border accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 z-10"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        ${colors.base}30 20%, 
                        ${colors.base}50 50%, 
                        ${colors.base}30 80%, 
                        transparent 100%
                      )`,
                    }}
                  />
                  
                  {/* Close button - fixed position outside scroll */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 group hover:bg-black/5 z-20"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                  
                  {/* Fixed top margin area */}
                  <div className="shrink-0 h-10 md:h-12" />
                  
                  {/* Middle row with left/right margins and scrollable content */}
                  <div className="flex-1 flex min-h-0">
                    {/* Fixed left margin area */}
                    <div className="shrink-0 w-8 md:w-12" />
                    
                    {/* Scrollable content container */}
                    <div 
                      className="relative overflow-y-auto flex-1"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(0,0,0,0.15) transparent',
                      }}
                    >
                      {/* Inner content with proper spacing */}
                      <div className="py-2 px-2">
                    {/* Letter header - location and date */}
                    <motion.div 
                      className="mb-8 text-right"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p 
                        className="text-sm italic mb-1"
                        style={{ color: '#9a8a7a', fontFamily: 'Georgia, serif' }}
                      >
                        {new Date(selectedLetter.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </motion.div>

                    {/* Letter title/salutation */}
                    <motion.div 
                      className="mb-8"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* Decorative flourish */}
                      <div 
                        className="w-20 h-px mb-5 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${colors.base}80, ${colors.glow}, ${colors.base}80)`,
                        }}
                      />
                      
                      <h2 
                        className="text-2xl md:text-3xl mb-2"
                        style={{ 
                          color: '#2d2418',
                          fontFamily: 'Georgia, serif',
                          fontWeight: 'normal',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {selectedLetter.title}
                      </h2>
                    </motion.div>

                    {/* Letter body - elegant formatting */}
                    <motion.div 
                      className="mb-10 space-y-5"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {/* Split message into paragraphs for proper formatting */}
                      {selectedLetter.message.split('\n\n').map((paragraph, index) => (
                        <p 
                          key={index}
                          className="leading-[2] text-base md:text-lg"
                          style={{ 
                            color: '#3d3428',
                            fontFamily: 'Georgia, serif',
                            textIndent: index === 0 ? '0' : '2.5em',
                            textAlign: 'justify',
                            hyphens: 'auto',
                          }}
                        >
                          {paragraph.split('\n').map((line, lineIndex) => (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < paragraph.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      ))}
                    </motion.div>

                    {/* Signature area */}
                    <motion.div 
                      className="mb-8 text-right"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p 
                        className="text-lg italic"
                        style={{ 
                          color: '#5a4a3a',
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        With all my love 💗
                      </p>
                    </motion.div>

                    {/* Audio controls - refined style */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-6 mt-4 border-t"
                      style={{ borderColor: 'rgba(0,0,0,0.08)' }}
                    >
                      <AudioControls audio={audio} />
                    </motion.div>

                      </div>
                    </div>
                    
                    {/* Fixed right margin area */}
                    <div className="shrink-0 w-8 md:w-12" />
                  </div>
                  
                  {/* Fixed bottom margin area */}
                  <div className="shrink-0 h-10 md:h-12" />
                  
                  {/* Subtle ambient sparkles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                          background: `radial-gradient(circle, ${colors.glow}80 0%, transparent 70%)`,
                        }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Decorative corner elements - repositioned outside scroll */}
                  <div 
                    className="absolute top-8 left-8 w-10 h-10 opacity-15 pointer-events-none z-10"
                    style={{
                      borderTop: `1.5px solid ${colors.base}`,
                      borderLeft: `1.5px solid ${colors.base}`,
                    }}
                  />
                  <div 
                    className="absolute bottom-8 right-8 w-10 h-10 opacity-15 pointer-events-none z-10"
                    style={{
                      borderBottom: `1.5px solid ${colors.base}`,
                      borderRight: `1.5px solid ${colors.base}`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
