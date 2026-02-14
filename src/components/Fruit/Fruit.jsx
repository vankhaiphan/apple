import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStore } from '../../hooks/useStore';
import * as THREE from 'three';
import gsap from 'gsap';

// AAA-quality realistic apple color palettes with natural variations
const APPLE_COLORS = {
  memories: { 
    base: '#c92a2a',
    gradient: '#8b1a1a',
    highlight: '#ff6b6b',
    blush: '#e03131',
    stem: '#4a3020',
    stemHighlight: '#6b4a35',
    waxCoat: '#ffcccc',
  },
  admiration: { 
    base: '#e67700',
    gradient: '#d9480f',
    highlight: '#ffc078',
    blush: '#fd7e14',
    stem: '#4a3020',
    stemHighlight: '#6b4a35',
    waxCoat: '#ffe4cc',
  },
  gratitude: { 
    base: '#d4a000',
    gradient: '#b8860b',
    highlight: '#ffe066',
    blush: '#fcc419',
    stem: '#4a3020',
    stemHighlight: '#6b4a35',
    waxCoat: '#fff8cc',
  },
  dreams: { 
    base: '#37b24d',
    gradient: '#2f9e44',
    highlight: '#8ce99a',
    blush: '#40c057',
    stem: '#4a3020',
    stemHighlight: '#6b4a35',
    waxCoat: '#ccffcc',
  },
  unsaid: { 
    base: '#be4bdb',
    gradient: '#9c36b5',
    highlight: '#e599f7',
    blush: '#cc5de8',
    stem: '#4a3020',
    stemHighlight: '#6b4a35',
    waxCoat: '#f0ccff',
  },
};

// Create AAA-quality realistic apple geometry with organic imperfections
function createAppleGeometry() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const positions = geometry.attributes.position;
  
  // Seed for consistent random variations per apple instance
  const seed = Math.random() * 1000;
  const noise = (x, y, z, freq = 1) => {
    return Math.sin(x * freq + seed) * Math.cos(y * freq + seed * 0.7) * Math.sin(z * freq + seed * 1.3);
  };
  
  for (let i = 0; i < positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);
    
    // Flatten into apple shape (apples are oblate)
    y *= 0.82;
    
    // Create the characteristic apple indent at top and bottom
    const distFromAxis = Math.sqrt(x * x + z * z);
    
    // Top indent (where stem goes) - deeper and more realistic
    if (y > 0.25) {
      const topFactor = Math.max(0, y - 0.25);
      y -= topFactor * topFactor * 1.0;
      const indentStrength = Math.exp(-distFromAxis * distFromAxis * 10);
      y -= indentStrength * 0.35;
      // Create slight ridge around indent
      y += Math.exp(-Math.pow(distFromAxis - 0.15, 2) * 40) * 0.03;
    }
    
    // Bottom indent - subtle
    if (y < -0.5) {
      const indentStrength = Math.exp(-distFromAxis * distFromAxis * 5);
      y += indentStrength * 0.12;
    }
    
    // Natural asymmetry - organic imperfection
    const asymmetry = noise(x, y, z, 3) * 0.025;
    x += asymmetry;
    z += asymmetry * 0.8;
    
    // Subtle lobes (apples have 5 subtle lobes)
    const angle = Math.atan2(z, x);
    const lobeFactor = 1 + Math.sin(angle * 5) * 0.025 * (1 - Math.abs(y));
    x *= lobeFactor;
    z *= lobeFactor;
    
    // Small surface irregularities for realism
    const surfaceNoise = noise(x * 15, y * 15, z * 15) * 0.008;
    const len = Math.sqrt(x * x + y * y + z * z);
    if (len > 0.01) {
      x += (x / len) * surfaceNoise;
      y += (y / len) * surfaceNoise;
      z += (z / len) * surfaceNoise;
    }
    
    positions.setXYZ(i, x, y, z);
  }
  
  geometry.computeVertexNormals();
  return geometry;
}

// Create realistic curved stem geometry
function createStemGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.008, 0.05, 0.004),
    new THREE.Vector3(-0.003, 0.1, 0.008),
    new THREE.Vector3(0.006, 0.15, 0.003),
    new THREE.Vector3(0.002, 0.2, -0.002),
  ]);
  
  return new THREE.TubeGeometry(curve, 16, 0.015, 8, false);
}

// Create realistic leaf geometry for stem
function createStemLeafGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.12, 0.03, 0.22, 0.12, 0.18, 0.32);
  shape.bezierCurveTo(0.12, 0.42, 0.04, 0.48, 0, 0.5);
  shape.bezierCurveTo(-0.04, 0.48, -0.12, 0.42, -0.18, 0.32);
  shape.bezierCurveTo(-0.22, 0.12, -0.12, 0.03, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(shape, 12);
  
  // Add natural curve and veining effect
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    // Main curve
    let z = Math.sin(y * Math.PI) * 0.1;
    // Secondary curve based on x position
    z += Math.sin(Math.abs(x) * Math.PI * 2) * 0.02;
    positions.setZ(i, z);
  }
  geometry.computeVertexNormals();
  
  return geometry;
}

export default function Fruit({ letter }) {
  const groupRef = useRef();
  const appleRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const setSelectedLetter = useStore((state) => state.setSelectedLetter);
  const hoveredFruit = useStore((state) => state.hoveredFruit);
  const setHoveredFruit = useStore((state) => state.setHoveredFruit);
  const introComplete = useStore((state) => state.introComplete);

  // Check if letter is unlocked (local timezone-aware: unlocks at 00:00:01 local time)
  const getLocalDateTime = (dateString, timeString = "00:00:01") => {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds || 0);
  };
  
  const currentLocalDateTime = new Date();
  const unlockLocalDateTime = getLocalDateTime(letter.unlockDate);
  const isUnlocked = letter.unlocked && currentLocalDateTime >= unlockLocalDateTime;

  // Get apple colors
  const appleColors = APPLE_COLORS[letter.branch] || APPLE_COLORS.memories;
  
  // Memoize geometries
  const appleGeometry = useMemo(() => createAppleGeometry(), []);
  const stemGeometry = useMemo(() => createStemGeometry(), []);
  const stemLeafGeometry = useMemo(() => createStemLeafGeometry(), []);
  
  // Create AAA-quality gradient material for apple with waxy coating effect
  const appleMaterial = useMemo(() => {
    // Generate unique variation based on letter id for organic differences
    const variation = letter.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 100 / 100;
    
    return new THREE.MeshPhysicalMaterial({
      color: isUnlocked ? appleColors.base : '#4a5568',
      roughness: 0.28 + variation * 0.08, // Slight variation in waxiness
      metalness: 0.01,
      clearcoat: 0.6, // Waxy apple coating
      clearcoatRoughness: 0.15,
      sheen: 0.5, // Soft sheen like real apples
      sheenRoughness: 0.4,
      sheenColor: isUnlocked ? new THREE.Color(appleColors.highlight) : new THREE.Color('#666'),
      envMapIntensity: 1.2,
      transmission: 0.02, // Very subtle translucency
    });
  }, [isUnlocked, appleColors, letter.id]);

  // Create stem material with wood-like properties
  const stemMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: appleColors.stem,
      roughness: 0.9,
      metalness: 0.02,
    });
  }, [appleColors]);

  // Animation
  useFrame((state) => {
    if (groupRef.current && introComplete) {
      const time = state.clock.elapsedTime + letter.id.length * 0.5;
      
      // Gentle swing like hanging from branch
      groupRef.current.rotation.z = Math.sin(time * 0.6) * 0.08;
      groupRef.current.rotation.x = Math.sin(time * 0.4 + 0.5) * 0.04;
      
      // Subtle position sway
      groupRef.current.position.x = letter.position[0] + Math.sin(time * 0.5) * 0.02;
      groupRef.current.position.y = letter.position[1] + Math.sin(time * 0.7) * 0.01;

      // Glow effect
      if (glowRef.current) {
        const baseGlow = isUnlocked ? 0.25 : 0.1;
        const pulse = isUnlocked ? Math.sin(time * 2) * 0.1 : 0;
        glowRef.current.material.opacity = baseGlow + pulse + (hovered ? 0.3 : 0);
      }
    }
  });

  const handleClick = () => {
    if (!isUnlocked || !introComplete) return;

    setSelectedLetter(letter);
    
    if (groupRef.current) {
      // Natural apple fall - no spinning, just gravity with subtle wobble
      const fallDuration = 0.9;
      
      // Gentle detach wobble
      gsap.to(groupRef.current.rotation, {
        z: groupRef.current.rotation.z + (Math.random() - 0.5) * 0.3,
        x: groupRef.current.rotation.x + (Math.random() - 0.5) * 0.2,
        duration: 0.15,
        ease: 'power1.out',
      });
      
      // Natural falling motion with slight acceleration
      gsap.to(groupRef.current.position, {
        y: letter.position[1] - 5,
        duration: fallDuration,
        ease: 'power2.in', // Accelerating fall like gravity
      });

      // Very subtle rotation during fall (not spinning)
      gsap.to(groupRef.current.rotation, {
        z: groupRef.current.rotation.z + (Math.random() - 0.5) * 0.5,
        x: groupRef.current.rotation.x + (Math.random() - 0.5) * 0.4,
        duration: fallDuration,
        ease: 'power1.in',
        delay: 0.15,
      });
      
      // Fade out as it falls off screen
      gsap.to(groupRef.current.scale, {
        x: 0.6,
        y: 0.6,
        z: 0.6,
        duration: 0.3,
        delay: fallDuration - 0.3,
        ease: 'power2.in',
      });
    }
  };

  const handlePointerOver = () => {
    if (!isUnlocked) return;
    setHovered(true);
    setHoveredFruit(letter.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    setHoveredFruit(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group ref={groupRef} position={letter.position}>
      {/* Main apple body - AAA quality */}
      <mesh
        ref={appleRef}
        geometry={appleGeometry}
        material={appleMaterial}
        scale={0.16}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      />
      
      {/* Apple waxy highlight - primary specular */}
      {isUnlocked && (
        <mesh position={[-0.035, 0.055, 0.11]} scale={[0.032, 0.042, 0.018]}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.55}
          />
        </mesh>
      )}
      
      {/* Secondary highlight - smaller, offset */}
      {isUnlocked && (
        <mesh position={[-0.055, 0.025, 0.095]} scale={[0.018, 0.022, 0.01]}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.35}
          />
        </mesh>
      )}
      
      {/* Tertiary highlight - edge reflection */}
      {isUnlocked && (
        <mesh position={[0.08, -0.02, 0.08]} scale={[0.012, 0.015, 0.008]}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Stem - realistic wood */}
      <mesh
        geometry={stemGeometry}
        material={stemMaterial}
        position={[0, 0.1, 0]}
        castShadow
      />
      
      {/* Stem leaf - natural green */}
      <mesh
        geometry={stemLeafGeometry}
        position={[0.02, 0.18, 0.01]}
        rotation={[0.25, 0.6, -0.35]}
        scale={0.14}
      >
        <meshStandardMaterial
          color="#3d7a1e"
          side={THREE.DoubleSide}
          roughness={0.65}
          metalness={0.03}
        />
      </mesh>

      {/* Soft glow aura for magical effect */}
      <mesh ref={glowRef} scale={0.21}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial
          color={isUnlocked ? appleColors.highlight : '#666666'}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Ambient occlusion shadow beneath apple */}
      <mesh position={[0, -0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.09}>
        <circleGeometry args={[1, 18]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Locked tooltip */}
      {!isUnlocked && hovered && (
        <Html position={[0, 0.3, 0]} center>
          <div className="bg-black/85 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/10">
            🔒 Ripens on {unlockDate.toLocaleDateString()}
          </div>
        </Html>
      )}

      {/* Title tooltip for unlocked */}
      {isUnlocked && hoveredFruit === letter.id && (
        <Html position={[0, 0.35, 0]} center>
          <div className="bg-black/85 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/10 shadow-xl">
            <span className="font-medium">{letter.title}</span>
          </div>
        </Html>
      )}
    </group>
  );
}
