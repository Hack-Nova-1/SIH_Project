import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  color: string;
  icon: string;
}

const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 1,
      name: "Basic",
      price: 9.99,
      period: "month",
      features: [
        "AI Health Assistant",
        "Basic Symptom Checker",
        "Doctor Directory",
        "Emergency Contacts",
        "Email Support"
      ],
      popular: false,
      color: "#69C181",
      icon: "fas fa-user"
    },
    {
      id: 2,
      name: "Premium",
      price: 19.99,
      period: "month",
      features: [
        "Everything in Basic",
        "Video Consultations",
        "Priority Support",
        "Health Analytics",
        "Prescription Management",
        "24/7 AI Chat",
        "Mobile App Access"
      ],
      popular: true,
      color: "#7B2CBF",
      icon: "fas fa-crown"
    },
    {
      id: 3,
      name: "Enterprise",
      price: 49.99,
      period: "month",
      features: [
        "Everything in Premium",
        "Custom AI Training",
        "API Access",
        "White-label Solution",
        "Dedicated Support",
        "Advanced Analytics",
        "Team Management",
        "Custom Integrations"
      ],
      popular: false,
      color: "#FF6B6B",
      icon: "fas fa-building"
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate section entrance
    gsap.fromTo(sectionRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Animate plan cards
    gsap.fromTo('.plan-card', 
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.2, delay: 1 }
    );
  }, []);

  const selectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    gsap.fromTo('.subscription-modal', 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  };

  const closeModal = () => {
    gsap.to('.subscription-modal', 
      { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.in' }
    );
    setTimeout(() => setSelectedPlan(null), 300);
  };

  const subscribe = async () => {
    setIsSubscribing(true);
    
    // Simulate subscription process
    setTimeout(() => {
      setIsSubscribing(false);
      // Show success animation
      gsap.fromTo('.success-animation', 
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      
      setTimeout(() => {
        closeModal();
      }, 2000);
    }, 3000);
  };

  return (
    <section ref={sectionRef} className="subscription-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h1 data-aos="fade-up">Choose Your Plan</h1>
              <p data-aos="fade-up" data-aos-delay="200">
                Unlock the full potential of Cure AI with our premium plans
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="plans-container">
              <div className="row">
                {plans.map((plan, index) => (
                  <div key={plan.id} className="col-lg-4 col-md-6 mb-4">
                    <div 
                      className={`plan-card ${plan.popular ? 'popular' : ''}`}
                      onClick={() => selectPlan(plan)}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <div className="plan-header">
                        <div className="plan-icon" style={{ color: plan.color }}>
                          <i className={plan.icon}></i>
                        </div>
                        {plan.popular && (
                          <div className="popular-badge">Most Popular</div>
                        )}
                      </div>
                      
                      <div className="plan-content">
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price">
                          <span className="currency">$</span>
                          <span className="amount">{plan.price}</span>
                          <span className="period">/{plan.period}</span>
                        </div>
                        
                        <ul className="plan-features">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>
                              <i className="fas fa-check"></i>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="plan-footer">
                        <button 
                          className="btn btn-primary-3d w-100"
                          style={{ background: `linear-gradient(45deg, ${plan.color}, ${plan.color}CC)` }}
                        >
                          <i className="fas fa-rocket"></i>
                          <span>Get Started</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="subscription-3d-container">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Subscription3DScene plans={plans} />
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
      </div>

      {/* Subscription Modal */}
      {selectedPlan && (
        <div className="subscription-modal-overlay" onClick={closeModal}>
          <div className="subscription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subscribe to {selectedPlan.name}</h3>
              <button className="close-modal" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="plan-summary">
                <div className="plan-icon-large" style={{ color: selectedPlan.color }}>
                  <i className={selectedPlan.icon}></i>
                </div>
                <div className="plan-details">
                  <h4>{selectedPlan.name} Plan</h4>
                  <div className="plan-price-large">
                    <span className="currency">$</span>
                    <span className="amount">{selectedPlan.price}</span>
                    <span className="period">/{selectedPlan.period}</span>
                  </div>
                </div>
              </div>
              
              <div className="payment-form">
                <h5>Payment Information</h5>
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input type="text" placeholder="John Doe" />
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary-3d w-100"
                onClick={subscribe}
                disabled={isSubscribing}
                style={{ background: `linear-gradient(45deg, ${selectedPlan.color}, ${selectedPlan.color}CC)` }}
              >
                {isSubscribing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card"></i>
                    <span>Subscribe Now</span>
                  </>
                )}
              </button>
            </div>
            
            {isSubscribing && (
              <div className="success-animation">
                <div className="success-icon">
                  <i className="fas fa-check"></i>
                </div>
                <p>Subscription Successful!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// 3D Subscription Scene Component
const Subscription3DScene: React.FC<{ plans: SubscriptionPlan[] }> = ({ plans }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  return (
    <group ref={groupRef}>
      {plans.map((plan, index) => (
        <PlanCard3D key={plan.id} plan={plan} index={index} />
      ))}
    </group>
  );
};

// Individual 3D Plan Card
const PlanCard3D: React.FC<{ plan: SubscriptionPlan, index: number }> = ({ plan, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const angle = (index * Math.PI * 2) / 3;
  const radius = 2.5;
  const height = Math.sin(angle * 2) * 0.5;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      groupRef.current.position.y = height;
      groupRef.current.rotation.y = -angle;
    }
  }, [angle, height]);

  const getColor = (color: string) => {
    switch (color) {
      case '#69C181': return '#69C181';
      case '#7B2CBF': return '#7B2CBF';
      case '#FF6B6B': return '#FF6B6B';
      default: return '#C8AFFF';
    }
  };

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial
          color={getColor(plan.color)}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
          emissive={getColor(plan.color)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Plan name text */}
      <Text3D
        position={[0, 0.5, 0.15]}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.2}
        height={0.03}
        color="#ffffff"
      >
        {plan.name}
      </Text3D>
      
      {/* Price text */}
      <Text3D
        position={[0, 0, 0.15]}
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.15}
        height={0.02}
        color="#ffffff"
      >
        ${plan.price}
      </Text3D>
      
      {/* Popular badge */}
      {plan.popular && (
        <mesh position={[0, 1, 0.15]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
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
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
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
        color="#7B2CBF"
        size={0.02}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default SubscriptionPage;