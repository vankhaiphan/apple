import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import Trunk from './Trunk';
import Branches from './Branches';
import Leaves from './Leaves';
import Fruits from '../Fruit/Fruits';
import lettersData from '../../data/letters.json';
import { useStore } from '../../hooks/useStore';
import gsap from 'gsap';

export default function Tree() {
  const groupRef = useRef();
  const introComplete = useStore((state) => state.introComplete);
  const setIntroComplete = useStore((state) => state.setIntroComplete);
  const animationStartedRef = useRef(false);

  // Breathing animation
  useFrame((state) => {
    if (groupRef.current && introComplete) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      groupRef.current.scale.y = 1 + breathe;
      
      // Subtle sway
      const sway = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      groupRef.current.rotation.z = sway;
    }
  });

  // Growth animation on mount
  useEffect(() => {
    if (!animationStartedRef.current) {
      // Small delay to ensure ref is ready
      const timer = setTimeout(() => {
        if (groupRef.current) {
          animationStartedRef.current = true;
          
          console.log('Starting tree growth animation');
          
          // Start tree at scale 0
          groupRef.current.scale.set(0, 0, 0);
          
          // Animate to full size
          gsap.to(groupRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 3,
            ease: 'power2.out',
            onComplete: () => {
              console.log('Tree growth complete');
              setIntroComplete(true);
            },
          });
        } else {
          console.log('Group ref not ready');
        }
      }, 100);
      
      // Fallback: ensure intro completes even if animation fails
      const fallbackTimer = setTimeout(() => {
        if (!animationStartedRef.current) {
          console.log('Animation fallback triggered - forcing intro complete');
          setIntroComplete(true);
        }
      }, 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(fallbackTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <group ref={groupRef}>
      <Trunk />
      <Branches />
      <Leaves />
      <Fruits letters={lettersData.letters} />
    </group>
  );
}
