import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VolumetricFog: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Volumetric fog shader
  const vertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      vNormal = normal;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uFogColor;
    uniform float uDensity;
    uniform vec3 uLightPosition;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    // Noise function for organic fog
    float noise(vec3 p) {
      return sin(p.x) * sin(p.y) * sin(p.z);
    }
    
    // Fractal noise
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return value;
    }
    
    void main() {
      vec3 fogColor = uFogColor;
      
      // Add noise-based density variation
      float noiseValue = fbm(vWorldPosition * 0.1 + uTime * 0.1);
      float density = uDensity * (0.5 + noiseValue * 0.5);
      
      // Distance-based fog
      float distance = length(vWorldPosition);
      float fogFactor = exp(-distance * density);
      
      // Add light scattering
      vec3 lightDir = normalize(uLightPosition - vWorldPosition);
      float scattering = pow(max(0.0, dot(vNormal, lightDir)), 2.0);
      fogColor += scattering * vec3(1.0, 0.8, 1.0) * 0.3;
      
      // Add time-based pulsing
      float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
      fogFactor *= pulse;
      
      gl_FragColor = vec4(fogColor, 1.0 - fogFactor);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uFogColor: { value: new THREE.Color(0.8, 0.4, 1.0) },
    uDensity: { value: 0.02 },
    uLightPosition: { value: new THREE.Vector3(0, 10, 0) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      
      // Animate fog movement
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 2;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[50, 50, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export default VolumetricFog;