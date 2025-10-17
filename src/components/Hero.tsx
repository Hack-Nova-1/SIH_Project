import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { y: 100, opacity: 0, scale: 0.5 },
      { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    // Parallax effect on scroll
    gsap.to(heroRef.current, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Floating animation for 3D elements
    gsap.to('.floating-element', {
      y: '+=20',
      duration: 3,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 ref={titleRef} className="hero-title" data-aos="fade-up">
                <span className="text-gradient">Cure AI</span>
                <br />
                <span className="subtitle">Revolutionary Healthcare</span>
              </h1>
              
              <p ref={subtitleRef} className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                Experience the future of healthcare with our AI-powered assistant. 
                Get instant medical guidance, connect with top doctors, and access 
                emergency services through our immersive 3D interface.
              </p>

              <div ref={ctaRef} className="hero-cta" data-aos="fade-up" data-aos-delay="400">
                <button className="btn btn-primary-3d me-3">
                  <i className="fas fa-rocket"></i>
                  <span>Start Your Journey</span>
                </button>
                <button className="btn btn-secondary-3d">
                  <i className="fas fa-play"></i>
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="hero-stats" data-aos="fade-up" data-aos-delay="600">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Patients Helped</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Expert Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99.9%</div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-3d-container">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <BrainModel />
                <ParticleSystem />
                <FloatingElements />
                
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={false} 
                  autoRotate={true}
                  autoRotateSpeed={1}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-arrow">
          <i className="fas fa-chevron-down"></i>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

// 3D Brain Model Component
const BrainModel: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 2,
        duration: 10,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
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
  );
};

// Particle System Component
const ParticleSystem: React.FC = () => {
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
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
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

// Floating Elements Component
const FloatingElements: React.FC = () => {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingElement key={i} index={i} />
      ))}
    </>
  );
};

const FloatingElement: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      const delay = index * 0.5;
      gsap.to(meshRef.current.position, {
        y: '+=2',
        duration: 2 + Math.random() * 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay
      });
    }
  }, [index]);

  const shapes = ['sphere', 'box', 'cone', 'torus'];
  const shape = shapes[index % shapes.length];

  return (
    <mesh
      ref={meshRef}
      position={[
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ]}
      className="floating-element"
    >
      {shape === 'sphere' && <sphereGeometry args={[0.1, 16, 16]} />}
      {shape === 'box' && <boxGeometry args={[0.2, 0.2, 0.2]} />}
      {shape === 'cone' && <coneGeometry args={[0.1, 0.3, 8]} />}
      {shape === 'torus' && <torusGeometry args={[0.1, 0.05, 8, 16]} />}
      <meshStandardMaterial
        color={index % 2 === 0 ? '#C8AFFF' : '#D97DD9'}
        transparent
        opacity={0.7}
        emissive={index % 2 === 0 ? '#7B2CBF' : '#A47CF3'}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export default Hero;