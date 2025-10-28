import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

interface EmergencyContact {
  id: number;
  name: string;
  type: 'hospital' | 'ambulance' | 'police' | 'fire';
  phone: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  status: 'available' | 'busy' | 'offline';
}

const EmergencyPage: React.FC = () => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: 1,
      name: "City General Hospital",
      type: 'hospital',
      phone: '+1-555-0123',
      location: { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' },
      status: 'available'
    },
    {
      id: 2,
      name: "Emergency Ambulance Service",
      type: 'ambulance',
      phone: '+1-555-0124',
      location: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', country: 'USA' },
      status: 'available'
    },
    {
      id: 3,
      name: "Metro Police Department",
      type: 'police',
      phone: '+1-555-0125',
      location: { lat: 41.8781, lng: -87.6298, city: 'Chicago', country: 'USA' },
      status: 'available'
    },
    {
      id: 4,
      name: "Fire & Rescue Station",
      type: 'fire',
      phone: '+1-555-0126',
      location: { lat: 29.7604, lng: -95.3698, city: 'Houston', country: 'USA' },
      status: 'busy'
    },
    {
      id: 5,
      name: "Regional Medical Center",
      type: 'hospital',
      phone: '+1-555-0127',
      location: { lat: 33.4484, lng: -112.0740, city: 'Phoenix', country: 'USA' },
      status: 'available'
    }
  ]);

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Animate section entrance
    gsap.fromTo(sectionRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Auto-rotate globe
    if (globeRef.current) {
      gsap.to(globeRef.current.rotation, {
        y: Math.PI * 2,
        duration: 30,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  const triggerEmergency = () => {
    setIsEmergencyActive(true);
    
    // Animate emergency button
    gsap.to('.emergency-button', {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'power2.inOut'
    });

    // Show emergency contacts
    setTimeout(() => {
      gsap.fromTo('.emergency-contacts', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
      );
    }, 1000);
  };

  const contactEmergency = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    
    // Simulate calling
    gsap.fromTo('.call-modal', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const endCall = () => {
    gsap.to('.call-modal', 
      { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.in' }
    );
    setTimeout(() => setSelectedContact(null), 300);
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'hospital': return 'fas fa-hospital';
      case 'ambulance': return 'fas fa-ambulance';
      case 'police': return 'fas fa-shield-alt';
      case 'fire': return 'fas fa-fire';
      default: return 'fas fa-phone';
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#69C181';
      case 'ambulance': return '#FF6B6B';
      case 'police': return '#4ECDC4';
      case 'fire': return '#FFA726';
      default: return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#69C181';
      case 'busy': return '#FFA726';
      case 'offline': return '#757575';
      default: return '#757575';
    }
  };

  return (
    <section ref={sectionRef} className="emergency-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h1 data-aos="fade-up">Emergency Services</h1>
              <p data-aos="fade-up" data-aos-delay="200">
                Get instant access to emergency services and healthcare providers
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="emergency-globe-container">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Globe3D 
                  ref={globeRef}
                  emergencyContacts={emergencyContacts}
                  userLocation={userLocation}
                />
                <ParticleField />
                
                <OrbitControls 
                  enablePan={false} 
                  enableZoom={true} 
                  autoRotate={true}
                  autoRotateSpeed={0.5}
                />
              </Canvas>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="emergency-controls">
              <div className="emergency-button-container">
                <button 
                  className={`emergency-button ${isEmergencyActive ? 'active' : ''}`}
                  onClick={triggerEmergency}
                >
                  <div className="button-inner">
                    <i className="fas fa-phone"></i>
                    <span>Emergency Call</span>
                  </div>
                  <div className="button-pulse"></div>
                </button>
              </div>

              <div className="emergency-info">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Find Nearest Hospital</span>
                  </button>
                  <button className="quick-action-btn">
                    <i className="fas fa-heartbeat"></i>
                    <span>Health Check</span>
                  </button>
                  <button className="quick-action-btn">
                    <i className="fas fa-user-md"></i>
                    <span>Doctor on Call</span>
                  </button>
                </div>
              </div>

              {isEmergencyActive && (
                <div className="emergency-contacts">
                  <h4>Emergency Contacts</h4>
                  <div className="contacts-list">
                    {emergencyContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="contact-card"
                        onClick={() => contactEmergency(contact)}
                      >
                        <div className="contact-icon" style={{ color: getContactColor(contact.type) }}>
                          <i className={getContactIcon(contact.type)}></i>
                        </div>
                        <div className="contact-info">
                          <h5>{contact.name}</h5>
                          <p>{contact.location.city}, {contact.location.country}</p>
                          <span className="contact-phone">{contact.phone}</span>
                        </div>
                        <div className="contact-status">
                          <div 
                            className="status-dot"
                            style={{ backgroundColor: getStatusColor(contact.status) }}
                          ></div>
                          <span className="status-text">{contact.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {selectedContact && (
        <div className="call-modal-overlay" onClick={endCall}>
          <div className="call-modal" onClick={(e) => e.stopPropagation()}>
            <div className="call-header">
              <div className="call-avatar">
                <i className={getContactIcon(selectedContact.type)}></i>
              </div>
              <div className="call-info">
                <h3>{selectedContact.name}</h3>
                <p>{selectedContact.phone}</p>
              </div>
            </div>
            
            <div className="call-status">
              <div className="calling-animation">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
              </div>
              <p>Connecting...</p>
            </div>
            
            <div className="call-actions">
              <button className="call-action-btn decline" onClick={endCall}>
                <i className="fas fa-phone-slash"></i>
              </button>
              <button className="call-action-btn accept">
                <i className="fas fa-phone"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// 3D Globe Component
const Globe3D = React.forwardRef<THREE.Group, { 
  emergencyContacts: EmergencyContact[], 
  userLocation: { lat: number; lng: number } | null 
}>(({ emergencyContacts, userLocation }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group ref={ref}>
      {/* Earth Globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#4A90E2"
          transparent
          opacity={0.8}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Emergency Contact Markers */}
      {emergencyContacts.map((contact, index) => (
        <EmergencyMarker 
          key={contact.id} 
          contact={contact} 
          index={index}
        />
      ))}

      {/* User Location Marker */}
      {userLocation && (
        <UserLocationMarker location={userLocation} />
      )}

      {/* Grid Lines */}
      <GridLines />
    </group>
  );
});

// Emergency Marker Component
const EmergencyMarker: React.FC<{ contact: EmergencyContact, index: number }> = ({ contact, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Convert lat/lng to 3D coordinates
  const lat = (contact.location.lat * Math.PI) / 180;
  const lng = (contact.location.lng * Math.PI) / 180;
  const radius = 2.1;

  const x = Math.cos(lat) * Math.cos(lng) * radius;
  const y = Math.sin(lat) * radius;
  const z = Math.cos(lat) * Math.sin(lng) * radius;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    // Pulsing animation
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        delay: index * 0.2
      });
    }
  }, [x, y, z, index]);

  const getContactColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#69C181';
      case 'ambulance': return '#FF6B6B';
      case 'police': return '#4ECDC4';
      case 'fire': return '#FFA726';
      default: return '#757575';
    }
  };

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={getContactColor(contact.type)} />
      </mesh>
      
      {/* Marker Ring */}
      <mesh>
        <ringGeometry args={[0.08, 0.12, 16]} />
        <meshBasicMaterial 
          color={getContactColor(contact.type)} 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// User Location Marker Component
const UserLocationMarker: React.FC<{ location: { lat: number; lng: number } }> = ({ location }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Convert lat/lng to 3D coordinates
  const lat = (location.lat * Math.PI) / 180;
  const lng = (location.lng * Math.PI) / 180;
  const radius = 2.1;

  const x = Math.cos(lat) * Math.cos(lng) * radius;
  const y = Math.sin(lat) * radius;
  const z = Math.cos(lat) * Math.sin(lng) * radius;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    // Pulsing animation
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 1.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      });
    }
  }, [x, y, z]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      
      {/* User marker ring */}
      <mesh>
        <ringGeometry args={[0.12, 0.16, 16]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

// Grid Lines Component
const GridLines: React.FC = () => {
  return (
    <group>
      {/* Latitude lines */}
      {Array.from({ length: 9 }).map((_, i) => {
        const lat = (i - 4) * Math.PI / 4;
        return (
          <mesh key={`lat-${i}`} rotation={[0, 0, 0]}>
            <ringGeometry args={[2.01, 2.02, 64]} />
            <meshBasicMaterial 
              color="#4A90E2" 
              transparent 
              opacity={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Longitude lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const lng = (i * Math.PI * 2) / 12;
        return (
          <mesh key={`lng-${i}`} rotation={[0, lng, 0]}>
            <ringGeometry args={[2.01, 2.02, 64]} />
            <meshBasicMaterial 
              color="#4A90E2" 
              transparent 
              opacity={0.3}
            />
          </mesh>
        );
      })}
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
        duration: 25,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  const particles = React.useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
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
        color="#FF6B6B"
        size={0.01}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default EmergencyPage;