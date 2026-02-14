import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instance, Instances } from '@react-three/drei';

// Create realistic apple leaf geometry
function createLeafGeometry() {
  const shape = new THREE.Shape();
  
  // Apple leaf shape - serrated edges with pointed tip
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.15, 0.5, 0.4, 0.35, 0.7);
  shape.bezierCurveTo(0.25, 0.85, 0.1, 0.95, 0, 1);
  shape.bezierCurveTo(-0.1, 0.95, -0.25, 0.85, -0.35, 0.7);
  shape.bezierCurveTo(-0.5, 0.4, -0.3, 0.15, 0, 0);
  
  const geometry = new THREE.ShapeGeometry(shape, 8);
  
  // Add some curvature to make it 3D
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    
    // Curve along the length (midrib)
    const curl = Math.sin(y * Math.PI) * 0.15;
    // Curve across (natural leaf cup shape)
    const cup = Math.abs(x) * 0.1;
    
    positions.setZ(i, curl - cup);
  }
  
  geometry.computeVertexNormals();
  return geometry;
}

// Generate leaf cluster positions around branch endpoints
function generateLeafClusters() {
  const clusters = [];
  
  // Define branch endpoints where leaves should cluster - x2 density for extremely lush canopy
  const branchEnds = [
    // Primary branch ends - extremely dense foliage
    { center: [-1.8, 3.8, 0.5], density: 170, radius: 1.2 },
    { center: [1.9, 4.0, 0.3], density: 180, radius: 1.25 },
    { center: [0.3, 4.2, 1.6], density: 160, radius: 1.15 },
    { center: [-0.2, 4.0, -1.5], density: 164, radius: 1.2 },
    { center: [0.8, 4.5, 0.8], density: 150, radius: 1.1 },
    { center: [-1.0, 4.3, -0.8], density: 144, radius: 1.05 },
    
    // Secondary branch ends - very dense foliage
    { center: [-2.4, 3.6, 1.2], density: 124, radius: 1.0 },
    { center: [2.2, 3.8, -1.0], density: 130, radius: 1.05 },
    { center: [-0.5, 4.8, 0.5], density: 116, radius: 0.95 },
    { center: [1.2, 4.6, 1.3], density: 124, radius: 1.0 },
    { center: [-1.5, 4.4, -1.2], density: 116, radius: 0.95 },
    { center: [0.2, 4.7, -1.4], density: 110, radius: 0.92 },
    
    // Twig ends - dense clusters
    { center: [-2.6, 3.3, 0.3], density: 80, radius: 0.8 },
    { center: [2.4, 3.5, 0.8], density: 84, radius: 0.82 },
    { center: [-1.2, 5.0, 0.2], density: 70, radius: 0.75 },
    { center: [0.8, 5.1, -0.3], density: 76, radius: 0.78 },
    { center: [-0.6, 4.9, 1.0], density: 70, radius: 0.75 },
    { center: [1.5, 4.8, -0.8], density: 74, radius: 0.77 },
    
    // Core canopy fill clusters - massive fullness and depth
    { center: [0, 4.3, 0], density: 140, radius: 1.1 },
    { center: [-1.3, 4.1, 0.9], density: 110, radius: 0.95 },
    { center: [1.3, 4.2, -0.5], density: 110, radius: 0.95 },
    { center: [0.5, 3.9, 1.2], density: 100, radius: 0.9 },
    { center: [-0.8, 4.5, -0.6], density: 104, radius: 0.92 },
    { center: [0.3, 4.6, 0.3], density: 96, radius: 0.88 },
    
    // Additional fill for extreme lushness
    { center: [0, 4.7, 0], density: 90, radius: 0.85 },
    { center: [-0.5, 3.8, -0.3], density: 84, radius: 0.82 },
    { center: [0.5, 4.3, 0.5], density: 80, radius: 0.8 },
    { center: [-0.3, 4.1, 0.4], density: 76, radius: 0.78 },
    { center: [0.3, 3.9, -0.5], density: 72, radius: 0.76 },
  ];
  
  branchEnds.forEach((cluster) => {
    for (let i = 0; i < cluster.density; i++) {
      // Spherical distribution within cluster
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);
      const r = cluster.radius * Math.cbrt(Math.random()); // Cubic root for volume distribution
      
      const x = cluster.center[0] + r * Math.sin(theta) * Math.cos(phi);
      const y = cluster.center[1] + r * Math.sin(theta) * Math.sin(phi) * 0.6; // Flatten vertically
      const z = cluster.center[2] + r * Math.cos(theta);
      
      // Natural leaf orientation - facing outward and slightly up
      const rotX = (Math.random() - 0.5) * 0.6 + 0.3; // Slight upward tilt
      const rotY = Math.atan2(z - cluster.center[2], x - cluster.center[0]) + Math.PI; // Face outward
      const rotZ = (Math.random() - 0.5) * 0.8;
      
      // Varied scale for natural look
      const scale = 0.12 + Math.random() * 0.08;
      
      // Color variation
      const colorIndex = Math.floor(Math.random() * 4);
      
      clusters.push({
        position: [x, y, z],
        rotation: [rotX, rotY, rotZ],
        scale,
        colorIndex,
        phase: Math.random() * Math.PI * 2, // For animation
      });
    }
  });
  
  return clusters;
}

// Leaf colors with natural variation
const LEAF_COLORS = [
  '#2d5016', // Deep green
  '#3a6b1e', // Medium green
  '#4a7d28', // Light green
  '#385f1d', // Forest green
];

export default function Leaves() {
  const groupRef = useRef();
  const leafGeometry = useMemo(() => createLeafGeometry(), []);
  const leaves = useMemo(() => generateLeafClusters(), []);
  
  // Create materials for each color variant
  const materials = useMemo(() => {
    return LEAF_COLORS.map((color) => (
      new THREE.MeshStandardMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
        roughness: 0.7,
        metalness: 0.05,
        alphaTest: 0.1,
      })
    ));
  }, []);

  // Gentle wind animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      groupRef.current.children.forEach((leaf, i) => {
        if (leaf.userData.phase !== undefined) {
          const phase = leaf.userData.phase;
          
          // Multi-frequency wind simulation
          const wind1 = Math.sin(time * 0.8 + phase) * 0.05;
          const wind2 = Math.sin(time * 1.3 + phase * 1.5) * 0.03;
          const wind3 = Math.sin(time * 2.1 + phase * 0.7) * 0.02;
          
          leaf.rotation.z = leaf.userData.baseRotZ + wind1 + wind2;
          leaf.rotation.x = leaf.userData.baseRotX + wind3;
          
          // Subtle position sway
          leaf.position.x = leaf.userData.baseX + wind1 * 0.3;
          leaf.position.y = leaf.userData.baseY + Math.abs(wind2) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, index) => (
        <mesh
          key={index}
          geometry={leafGeometry}
          material={materials[leaf.colorIndex]}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
          castShadow
          receiveShadow
          userData={{
            phase: leaf.phase,
            baseRotZ: leaf.rotation[2],
            baseRotX: leaf.rotation[0],
            baseX: leaf.position[0],
            baseY: leaf.position[1],
          }}
        />
      ))}
      
      {/* Add leaf vein detail with subtle lines */}
      {leaves.filter((_, i) => i % 5 === 0).map((leaf, index) => (
        <mesh
          key={`vein-${index}`}
          position={[leaf.position[0], leaf.position[1], leaf.position[2] + 0.001]}
          rotation={leaf.rotation}
          scale={leaf.scale * 0.95}
        >
          <planeGeometry args={[0.02, 0.8]} />
          <meshBasicMaterial
            color="#1a3010"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
