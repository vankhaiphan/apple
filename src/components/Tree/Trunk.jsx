import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create bark texture procedurally
function createBarkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base bark color
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#3d2817');
  gradient.addColorStop(0.3, '#2d1f12');
  gradient.addColorStop(0.6, '#4a3520');
  gradient.addColorStop(1, '#2a1810');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Add vertical bark lines
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 512;
    const width = 2 + Math.random() * 6;
    const height = 100 + Math.random() * 400;
    const y = Math.random() * 512;
    
    ctx.fillStyle = `rgba(${20 + Math.random() * 30}, ${15 + Math.random() * 20}, ${10 + Math.random() * 15}, ${0.3 + Math.random() * 0.4})`;
    ctx.fillRect(x, y, width, height);
  }

  // Add bark cracks and detail
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 30, y + Math.random() * 60);
    ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.stroke();
  }

  // Add highlights
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = 2 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(80, 60, 40, ${0.1 + Math.random() * 0.15})`;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  return texture;
}

// Create bump map for bark depth
function createBarkBumpMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Vertical ridges
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 256;
    const width = 3 + Math.random() * 8;
    ctx.fillStyle = `rgb(${100 + Math.random() * 80}, ${100 + Math.random() * 80}, ${100 + Math.random() * 80})`;
    ctx.fillRect(x, 0, width, 256);
  }

  // Deep cracks (dark)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 20, y + Math.random() * 50);
    ctx.strokeStyle = `rgb(${40 + Math.random() * 40}, ${40 + Math.random() * 40}, ${40 + Math.random() * 40})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 3);
  return texture;
}

// Custom trunk geometry with natural curves
function createTrunkGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.05, 0.8, 0.02),
    new THREE.Vector3(-0.03, 1.6, -0.01),
    new THREE.Vector3(0.02, 2.4, 0.03),
    new THREE.Vector3(-0.02, 3.2, -0.02),
    new THREE.Vector3(0.01, 4, 0.01),
  ]);

  const radialSegments = 24;
  const heightSegments = 40;
  const points = curve.getPoints(heightSegments);
  
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Create vertices with varying radius
  for (let i = 0; i <= heightSegments; i++) {
    const t = i / heightSegments;
    const point = points[i];
    
    // Radius decreases towards top with natural taper
    const baseRadius = 0.45 - t * 0.25;
    const radius = baseRadius + Math.sin(t * Math.PI * 4) * 0.02; // Subtle waviness
    
    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      
      // Add slight irregularity to make it organic
      const irregularity = 1 + Math.sin(theta * 3 + t * 5) * 0.05 + Math.cos(theta * 7) * 0.03;
      const r = radius * irregularity;
      
      const x = point.x + Math.cos(theta) * r;
      const y = point.y;
      const z = point.z + Math.sin(theta) * r;
      
      vertices.push(x, y, z);
      
      // Normal pointing outward
      const nx = Math.cos(theta);
      const nz = Math.sin(theta);
      normals.push(nx, 0, nz);
      
      // UV coordinates
      uvs.push(j / radialSegments, t);
    }
  }

  // Create faces
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

// Root system geometry
function createRootGeometry(angle, length, thickness) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(Math.cos(angle) * length * 0.4, -0.1, Math.sin(angle) * length * 0.4),
    new THREE.Vector3(Math.cos(angle) * length * 0.7, -0.15, Math.sin(angle) * length * 0.7),
    new THREE.Vector3(Math.cos(angle) * length, -0.2, Math.sin(angle) * length),
  ]);
  
  return new THREE.TubeGeometry(curve, 12, thickness, 8, false);
}

export default function Trunk() {
  const trunkRef = useRef();
  
  const barkTexture = useMemo(() => createBarkTexture(), []);
  const barkBump = useMemo(() => createBarkBumpMap(), []);
  const trunkGeometry = useMemo(() => createTrunkGeometry(), []);
  
  // Generate root positions
  const roots = useMemo(() => {
    const rootData = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.3;
      const length = 0.4 + Math.random() * 0.3;
      const thickness = 0.06 + Math.random() * 0.04;
      rootData.push({ angle, length, thickness });
    }
    return rootData;
  }, []);

  return (
    <group ref={trunkRef}>
      {/* Main trunk */}
      <mesh geometry={trunkGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          map={barkTexture}
          bumpMap={barkBump}
          bumpScale={0.15}
          color="#4a3828"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Root flares */}
      {roots.map((root, index) => (
        <mesh
          key={`root-${index}`}
          geometry={createRootGeometry(root.angle, root.length, root.thickness)}
          position={[0, 0.1, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            map={barkTexture}
            bumpMap={barkBump}
            bumpScale={0.1}
            color="#3d2d1e"
            roughness={0.95}
            metalness={0.02}
          />
        </mesh>
      ))}

      {/* Base collar where trunk meets ground */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.48, 0.12, 8, 24]} />
        <meshStandardMaterial
          color="#2d2015"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
