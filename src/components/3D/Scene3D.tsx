import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const Scene3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const scroll = useScroll();

  // Custom vertex shader for morphing effects
  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      vec3 pos = position;
      
      // Add wave distortion based on time and scroll
      float wave = sin(pos.x * 0.1 + uTime) * cos(pos.z * 0.1 + uTime) * 0.5;
      pos.y += wave * (1.0 + uScroll);
      
      // Add scroll-based morphing
      pos += normal * sin(uTime + uScroll * 2.0) * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Custom fragment shader for ethereal glow
  const fragmentShader = `
    uniform float uTime;
    uniform float uScroll;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vec3 color = vec3(0.8, 0.4, 1.0); // Purple base
      
      // Add pulsing effect
      float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
      color *= (0.5 + pulse * 0.5);
      
      // Add scroll-based intensity
      color *= (1.0 + uScroll * 0.5);
      
      // Add rim lighting
      float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
      color += rim * vec3(1.0, 0.8, 1.0) * 0.3;
      
      // Add noise for organic feel
      float noise = sin(vPosition.x * 10.0) * sin(vPosition.y * 10.0) * sin(vPosition.z * 10.0);
      color += noise * 0.1;
      
      gl_FragColor = vec4(color, 0.3);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uScroll.value = scroll.offset;
      
      // Rotate the mesh
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Central morphing orb */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <OrbitingParticle key={i} index={i} />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#C8AFFF" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#7B2CBF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D97DD9" />
    </group>
  );
};

const OrbitingParticle: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const radius = 3 + index * 0.2;
      const speed = 0.5 + index * 0.1;
      
      meshRef.current.position.x = Math.cos(time * speed + index) * radius;
      meshRef.current.position.z = Math.sin(time * speed + index) * radius;
      meshRef.current.position.y = Math.sin(time * speed * 0.5 + index) * 2;
      
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial 
        color="#C8AFFF" 
        transparent 
        opacity={0.6}
      />
    </mesh>
  );
};

export default Scene3D;