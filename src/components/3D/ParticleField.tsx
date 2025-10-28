import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create particle system
  const { positions, colors, sizes } = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a large sphere
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Random colors in purple/pink range
      const color = new THREE.Color();
      color.setHSL(0.7 + Math.random() * 0.2, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  // Custom shader for particles
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    uniform float uTime;
    
    void main() {
      vColor = color;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Add floating animation
      mvPosition.y += sin(uTime + position.x * 0.1) * 0.5;
      mvPosition.x += cos(uTime + position.z * 0.1) * 0.3;
      
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    uniform float uTime;
    
    void main() {
      // Create circular particles
      float distance = length(gl_PointCoord - vec2(0.5));
      if (distance > 0.5) discard;
      
      // Add pulsing effect
      float pulse = sin(uTime * 2.0 + gl_PointCoord.x * 10.0) * 0.5 + 0.5;
      
      // Add glow effect
      float glow = 1.0 - distance * 2.0;
      glow = pow(glow, 2.0);
      
      gl_FragColor = vec4(vColor * (0.5 + pulse * 0.5), glow * 0.8);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;