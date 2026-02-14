import { Environment, OrbitControls, PerspectiveCamera, Sky } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import Tree from '../Tree/Tree';
import FloatingParticles from '../Effects/FloatingParticles';
import AmbientSound from '../Effects/AmbientSound';
import * as THREE from 'three';

export default function SceneContent() {
  return (
    <>
      {/* Background - deep twilight gradient */}
      <color attach="background" args={['#080810']} />
      
      {/* Camera - positioned for cinematic view */}
      <PerspectiveCamera makeDefault position={[0, 2.5, 7]} fov={45} />
      
      {/* Controls - smooth and intuitive */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4.5}
        maxDistance={12}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.03}
        target={[0, 2.5, 0]}
        rotateSpeed={0.5}
      />

      {/* === LIGHTING SYSTEM === */}
      
      {/* Global ambient - soft fill */}
      <ambientLight intensity={0.25} color="#e8dfd5" />
      
      {/* Key light - warm golden hour sun */}
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.8}
        color="#fff2e0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - cool sky bounce */}
      <directionalLight
        position={[-4, 6, -2]}
        intensity={0.5}
        color="#c7d9f5"
      />
      
      {/* Back/rim light - cinematic separation */}
      <directionalLight
        position={[0, 8, -5]}
        intensity={0.7}
        color="#ffd4e8"
      />
      
      {/* Canopy highlight - internal glow through leaves */}
      <pointLight 
        position={[0, 4.5, 0]} 
        intensity={1.2} 
        color="#ffe8d6" 
        distance={6} 
        decay={2} 
      />
      
      {/* Accent lights for apples - makes them glow invitingly */}
      <pointLight 
        position={[-2, 3.5, 1.5]} 
        intensity={0.8} 
        color="#ffb3b3" 
        distance={4} 
        decay={2} 
      />
      <pointLight 
        position={[2, 3.8, -1]} 
        intensity={0.7} 
        color="#ffe0b3" 
        distance={4} 
        decay={2} 
      />
      <pointLight 
        position={[0.5, 4.2, 1.8]} 
        intensity={0.6} 
        color="#b3ffb3" 
        distance={3.5} 
        decay={2} 
      />
      
      {/* Ground bounce light */}
      <pointLight 
        position={[0, 0.5, 0]} 
        intensity={0.3} 
        color="#3d2817" 
        distance={5} 
        decay={2} 
      />
      
      {/* Soft spotlight for trunk detail */}
      <spotLight
        position={[0, 1, 4]}
        angle={0.4}
        penumbra={1}
        intensity={0.5}
        color="#ffeedd"
        target-position={[0, 1.5, 0]}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset="sunset" background={false} />
      
      {/* Atmospheric fog - adds depth */}
      <fog attach="fog" args={['#0a0a12', 8, 30]} />

      {/* === MAIN CONTENT === */}
      <Tree />
      <FloatingParticles />
      
      {/* Ground - textured grass hint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[20, 128]} />
        <meshStandardMaterial 
          color="#1a1f15"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>
      
      {/* Ground shadow catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
      
      {/* Subtle ground glow under tree */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial 
          color="#ffd6b3"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* === POST PROCESSING === */}
      <EffectComposer>
        {/* Bloom - soft glow on apples and highlights */}
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.8}
          mipmapBlur
          radius={0.85}
        />
        {/* Vignette - cinematic framing */}
        <Vignette
          offset={0.3}
          darkness={0.5}
          eskil={false}
        />
      </EffectComposer>

      {/* Audio */}
      <AmbientSound />
    </>
  );
}
