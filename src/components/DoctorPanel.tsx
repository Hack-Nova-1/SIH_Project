import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  price: number;
  description: string;
}

const DoctorPanel: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      specialty: "Cardiology",
      rating: 4.9,
      experience: 15,
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      status: 'online',
      price: 150,
      description: "Expert in heart health and cardiovascular diseases"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      specialty: "Neurology",
      rating: 4.8,
      experience: 12,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      status: 'online',
      price: 180,
      description: "Specialist in brain and nervous system disorders"
    },
    {
      id: 3,
      name: "Dr. Emily Watson",
      specialty: "Pediatrics",
      rating: 4.9,
      experience: 10,
      avatar: "https://images.unsplash.com/photo-1594824373636-4b192b2e8f90?w=150&h=150&fit=crop&crop=face",
      status: 'busy',
      price: 120,
      description: "Caring for children's health and development"
    },
    {
      id: 4,
      name: "Dr. James Thompson",
      specialty: "Orthopedics",
      rating: 4.7,
      experience: 18,
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      status: 'online',
      price: 200,
      description: "Expert in bone, joint, and muscle health"
    },
    {
      id: 5,
      name: "Dr. Lisa Park",
      specialty: "Dermatology",
      rating: 4.8,
      experience: 8,
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      status: 'offline',
      price: 130,
      description: "Specialist in skin, hair, and nail conditions"
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      specialty: "Psychiatry",
      rating: 4.9,
      experience: 14,
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      status: 'online',
      price: 160,
      description: "Mental health and psychological well-being expert"
    }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate section entrance
    gsap.fromTo(sectionRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Auto-rotate carousel
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % doctors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [doctors.length]);

  const nextDoctor = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
  };

  const prevDoctor = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    gsap.fromTo('.doctor-modal', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const closeModal = () => {
    gsap.to('.doctor-modal', 
      { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.in' }
    );
    setTimeout(() => setSelectedDoctor(null), 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#69C181';
      case 'busy': return '#FFA726';
      case 'offline': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <section ref={sectionRef} className="doctor-panel-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h2 data-aos="fade-up">Connect with Expert Doctors</h2>
              <p data-aos="fade-up" data-aos-delay="200">
                Our AI-powered platform connects you with top healthcare professionals
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="doctor-carousel-container">
              <div className="carousel-controls">
                <button className="carousel-btn prev" onClick={prevDoctor}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="carousel-btn next" onClick={nextDoctor}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="doctor-3d-carousel" ref={carouselRef}>
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 75 }}
                  gl={{ antialias: true, alpha: true }}
                  dpr={[1, 2]}
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  
                  <HelixCarousel doctors={doctors} currentIndex={currentIndex} />
                  <ParticleField />
                  
                  <OrbitControls 
                    enablePan={false} 
                    enableZoom={false} 
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="doctor-info-panel">
              <div className="current-doctor-card">
                <div className="doctor-avatar">
                  <img 
                    src={doctors[currentIndex]?.avatar} 
                    alt={doctors[currentIndex]?.name}
                    className="avatar-image"
                  />
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(doctors[currentIndex]?.status || 'offline') }}
                  ></div>
                </div>
                
                <div className="doctor-details">
                  <h4>{doctors[currentIndex]?.name}</h4>
                  <p className="specialty">{doctors[currentIndex]?.specialty}</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < Math.floor(doctors[currentIndex]?.rating || 0) ? 'filled' : ''}`}
                      ></i>
                    ))}
                    <span className="rating-text">({doctors[currentIndex]?.rating})</span>
                  </div>
                  <p className="experience">{doctors[currentIndex]?.experience} years experience</p>
                  <p className="description">{doctors[currentIndex]?.description}</p>
                  
                  <div className="doctor-actions">
                    <button 
                      className="btn btn-primary-3d w-100 mb-2"
                      onClick={() => selectDoctor(doctors[currentIndex])}
                    >
                      <i className="fas fa-video"></i>
                      <span>Video Consult - ${doctors[currentIndex]?.price}</span>
                    </button>
                    <button className="btn btn-secondary-3d w-100">
                      <i className="fas fa-message"></i>
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Modal */}
      {selectedDoctor && (
        <div className="doctor-modal-overlay" onClick={closeModal}>
          <div className="doctor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDoctor.name}</h3>
              <button className="close-modal" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-avatar">
                <img src={selectedDoctor.avatar} alt={selectedDoctor.name} />
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(selectedDoctor.status) }}
                >
                  {getStatusText(selectedDoctor.status)}
                </div>
              </div>
              
              <div className="modal-details">
                <h4>{selectedDoctor.specialty}</h4>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(selectedDoctor.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                  <span>({selectedDoctor.rating})</span>
                </div>
                <p>{selectedDoctor.description}</p>
                <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                <p><strong>Consultation Fee:</strong> ${selectedDoctor.price}</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn btn-primary-3d">
                <i className="fas fa-video"></i>
                <span>Start Video Call</span>
              </button>
              <button className="btn btn-secondary-3d">
                <i className="fas fa-calendar"></i>
                <span>Schedule Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// 3D Helix Carousel Component
const HelixCarousel: React.FC<{ doctors: Doctor[], currentIndex: number }> = ({ doctors, currentIndex }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: (currentIndex * Math.PI * 2) / doctors.length,
        duration: 1,
        ease: 'power2.inOut'
      });
    }
  }, [currentIndex, doctors.length]);

  return (
    <group ref={groupRef}>
      {doctors.map((doctor, index) => (
        <DoctorCard3D 
          key={doctor.id} 
          doctor={doctor} 
          index={index} 
          total={doctors.length}
        />
      ))}
    </group>
  );
};

// Individual 3D Doctor Card
const DoctorCard3D: React.FC<{ doctor: Doctor, index: number, total: number }> = ({ doctor, index, total }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const angle = (index * Math.PI * 2) / total;
  const radius = 3;
  const height = Math.sin(angle * 2) * 2;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = height;
      groupRef.current.rotation.y = -angle;
    }
  }, [angle, height]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 3, 0.2]} />
        <meshStandardMaterial
          color="#C8AFFF"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
          emissive="#7B2CBF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Doctor name text */}
      <Text3D
        position={[0, 1, 0.1]}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.3}
        height={0.05}
        color="#ffffff"
      >
        {doctor.name}
      </Text3D>
      
      {/* Specialty text */}
      <Text3D
        position={[0, 0.5, 0.1]}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.2}
        height={0.03}
        color="#D97DD9"
      >
        {doctor.specialty}
      </Text3D>
      
      {/* Status indicator */}
      <mesh position={[0.8, 1.2, 0.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial 
          color={doctor.status === 'online' ? '#69C181' : 
                 doctor.status === 'busy' ? '#FFA726' : '#757575'}
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
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
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
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default DoctorPanel;