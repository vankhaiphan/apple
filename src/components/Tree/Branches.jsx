import { useMemo } from 'react';
import * as THREE from 'three';

// Create organic branch curve
function createBranchCurve(start, end, bendFactor = 0.3) {
  const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
  // Add natural curve/bend
  mid.y += (end.y - start.y) * bendFactor * (0.5 + Math.random() * 0.5);
  mid.x += (Math.random() - 0.5) * 0.3;
  mid.z += (Math.random() - 0.5) * 0.3;
  
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

// Create branch geometry with tapering
function createBranchGeometry(curve, startRadius, endRadius, segments = 16) {
  const frames = curve.computeFrenetFrames(segments, false);
  const geometry = new THREE.BufferGeometry();
  
  const vertices = [];
  const normals = [];
  const uvs = [];
  const indices = [];
  
  const radialSegments = 12;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = curve.getPointAt(t);
    const T = frames.tangents[i];
    const N = frames.normals[i];
    const B = frames.binormals[i];
    
    // Taper radius
    const radius = THREE.MathUtils.lerp(startRadius, endRadius, t);
    // Add slight irregularity
    const irregularity = 1 + Math.sin(t * 8) * 0.08;
    
    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const r = radius * irregularity * (1 + Math.cos(theta * 3) * 0.05);
      
      const nx = Math.cos(theta);
      const nz = Math.sin(theta);
      
      const x = point.x + (N.x * nx + B.x * nz) * r;
      const y = point.y + (N.y * nx + B.y * nz) * r;
      const z = point.z + (N.z * nx + B.z * nz) * r;
      
      vertices.push(x, y, z);
      
      // Compute normal
      const normal = new THREE.Vector3(N.x * nx + B.x * nz, N.y * nx + B.y * nz, N.z * nx + B.z * nz).normalize();
      normals.push(normal.x, normal.y, normal.z);
      
      uvs.push(j / radialSegments, t);
    }
  }
  
  // Create faces
  for (let i = 0; i < segments; i++) {
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

// Branch data structure
function generateBranchStructure() {
  const branches = [];
  
  // Primary scaffold branches (main structure)
  const primaryBranches = [
    { start: [0, 3.2, 0], angle: Math.PI * 0.25, elevation: 0.6, length: 2.2, radius: 0.12 },
    { start: [0, 3, 0], angle: Math.PI * 0.75, elevation: 0.55, length: 2.0, radius: 0.11 },
    { start: [0, 3.4, 0], angle: Math.PI * 1.25, elevation: 0.5, length: 2.3, radius: 0.13 },
    { start: [0, 3.1, 0], angle: Math.PI * 1.75, elevation: 0.6, length: 2.1, radius: 0.11 },
    { start: [0, 3.6, 0], angle: Math.PI * 0.5, elevation: 0.7, length: 1.8, radius: 0.09 },
    { start: [0, 3.5, 0], angle: Math.PI * 1.5, elevation: 0.65, length: 1.9, radius: 0.1 },
  ];
  
  primaryBranches.forEach((branch, idx) => {
    const startPos = new THREE.Vector3(...branch.start);
    const endX = startPos.x + Math.cos(branch.angle) * branch.length;
    const endY = startPos.y + Math.sin(branch.elevation) * branch.length * 0.5;
    const endZ = startPos.z + Math.sin(branch.angle) * branch.length;
    const endPos = new THREE.Vector3(endX, endY, endZ);
    
    branches.push({
      type: 'primary',
      curve: createBranchCurve(startPos, endPos, 0.2),
      startRadius: branch.radius,
      endRadius: branch.radius * 0.4,
      endPoint: endPos,
      angle: branch.angle,
    });
    
    // Secondary branches from primaries (reduced number)
    const numSecondary = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numSecondary; i++) {
      const t = 0.4 + (i / numSecondary) * 0.5;
      const branchPoint = branches[branches.length - 1].curve.getPointAt(t);
      
      const secAngle = branch.angle + (Math.random() - 0.5) * Math.PI * 0.6;
      const secLength = branch.length * (0.5 + Math.random() * 0.3);
      const secElevation = branch.elevation * (0.7 + Math.random() * 0.4);
      
      const secEndX = branchPoint.x + Math.cos(secAngle) * secLength;
      const secEndY = branchPoint.y + Math.sin(secElevation) * secLength * 0.4;
      const secEndZ = branchPoint.z + Math.sin(secAngle) * secLength;
      const secEndPos = new THREE.Vector3(secEndX, secEndY, secEndZ);
      
      branches.push({
        type: 'secondary',
        curve: createBranchCurve(branchPoint, secEndPos, 0.25),
        startRadius: branch.radius * 0.45,
        endRadius: branch.radius * 0.12,
        endPoint: secEndPos,
        angle: secAngle,
      });
      
      // Tertiary branches (twigs)
      const numTertiary = 1 + Math.floor(Math.random() * 2);
      for (let j = 0; j < numTertiary; j++) {
        const tt = 0.5 + (j / numTertiary) * 0.4;
        const tPoint = branches[branches.length - 1].curve.getPointAt(tt);
        
        const tAngle = secAngle + (Math.random() - 0.5) * Math.PI * 0.8;
        const tLength = secLength * (0.3 + Math.random() * 0.3);
        
        const tEndX = tPoint.x + Math.cos(tAngle) * tLength;
        const tEndY = tPoint.y + (Math.random() * 0.3) * tLength;
        const tEndZ = tPoint.z + Math.sin(tAngle) * tLength;
        const tEndPos = new THREE.Vector3(tEndX, tEndY, tEndZ);
        
        branches.push({
          type: 'twig',
          curve: createBranchCurve(tPoint, tEndPos, 0.15),
          startRadius: branch.radius * 0.15,
          endRadius: branch.radius * 0.03,
          endPoint: tEndPos,
          angle: tAngle,
        });
      }
    }
  });
  
  return branches;
}

export default function Branches() {
  const branches = useMemo(() => generateBranchStructure(), []);
  
  // Create bark texture for branches
  const barkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#5a4535',
      roughness: 0.9,
      metalness: 0.02,
    });
  }, []);

  return (
    <group>
      {branches.map((branch, index) => {
        const geometry = createBranchGeometry(
          branch.curve,
          branch.startRadius,
          branch.endRadius,
          branch.type === 'twig' ? 8 : branch.type === 'secondary' ? 12 : 16
        );
        
        // Vary color slightly for depth - matching trunk tone
        const colorVariation = 0.95 + Math.random() * 0.1;
        const color = new THREE.Color('#4a3828').multiplyScalar(colorVariation);
        
        return (
          <mesh
            key={index}
            geometry={geometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={color}
              roughness={0.85 + Math.random() * 0.1}
              metalness={0.02}
            />
          </mesh>
        );
      })}
    </group>
  );
}
