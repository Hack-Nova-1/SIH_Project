import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { gsap } from 'gsap';

const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Animate loading screen entrance
    gsap.fromTo(loadingRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.to(loadingRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (loadingRef.current) {
            loadingRef.current.style.display = 'none';
          }
        }
      });
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div ref={loadingRef} className="loading-screen">
      <div className="loading-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="loading-content">
        <div className="loading-3d-container">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <Loading3DScene />
            <ParticleField />
            
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              autoRotate={true}
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>

        <div className="loading-text">
          <h1 className="loading-title">
            <span className="text-gradient">Cure AI</span>
          </h1>
          <p className="loading-subtitle">Revolutionary Healthcare Assistant</p>
        </div>

        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span className="progress-percentage">{Math.round(progress)}%</span>
            <span className="progress-label">Loading Experience...</span>
          </div>
        </div>

        <div className="loading-features">
          <div className="feature-item">
            <i className="fas fa-brain"></i>
            <span>AI-Powered</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-user-md"></i>
            <span>Expert Doctors</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-shield-alt"></i>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3D Loading Scene Component
const Loading3DScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 4,
        ease: 'none',
        repeat: -1
      });
    }

    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: Math.PI * 0.1,
        y: Math.PI * 0.1,
        duration: 6,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* Central morphing brain */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#C8AFFF"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
          emissive="#7B2CBF"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner core */}
      <mesh scale={[0.6, 0.6, 0.6]}>
        <octahedronGeometry args={[1.5, 2]} />
        <meshStandardMaterial
          color="#D97DD9"
          transparent
          opacity={0.6}
          roughness={0.05}
          metalness={0.95}
          emissive="#A47CF3"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Orbiting elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <OrbitingElement key={i} index={i} />
      ))}
    </group>
  );
};

// Orbiting Element Component
const OrbitingElement: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      const angle = (index * Math.PI * 2) / 6;
      const radius = 2.5;
      
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = Math.sin(angle * 2) * 0.5;
    }

    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 3 + index * 0.5,
        ease: 'none',
        repeat: -1
      });
    }
  }, [index]);

  const shapes = ['sphere', 'box', 'cone', 'torus', 'octahedron', 'tetrahedron'];
  const shape = shapes[index % shapes.length];

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        {shape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
        {shape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
        {shape === 'cone' && <coneGeometry args={[0.2, 0.4, 8]} />}
        {shape === 'torus' && <torusGeometry args={[0.15, 0.05, 8, 16]} />}
        {shape === 'octahedron' && <octahedronGeometry args={[0.2, 0]} />}
        {shape === 'tetrahedron' && <tetrahedronGeometry args={[0.2]} />}
        <meshStandardMaterial
          color={index % 2 === 0 ? '#C8AFFF' : '#D97DD9'}
          transparent
          opacity={0.7}
          emissive={index % 2 === 0 ? '#7B2CBF' : '#A47CF3'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// Particle Field Component
const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (pointsRef.current) {
      gsap.to(pointsRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  const particles = React.useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D97DD9"
        size={0.02}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default LoadingScreen;