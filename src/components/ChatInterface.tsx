import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Cure AI, your personal healthcare assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate chat widget entrance
    gsap.fromTo('.chat-widget', 
      { scale: 0, rotation: 180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 2 }
    );

    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      gsap.fromTo('.chat-container', 
        { y: '100%', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to('.chat-container', 
        { y: '100%', opacity: 0, duration: 0.3, ease: 'power3.in' }
      );
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: "I understand your concern. Based on your symptoms, I recommend consulting with a healthcare professional. Would you like me to connect you with a doctor?",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget */}
      <div className="chat-widget" onClick={toggleChat}>
        <div className="crystal-container">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 75 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            
            <CrystalModel isOpen={isOpen} />
            <ParticleField />
            
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              autoRotate={!isOpen}
              autoRotateSpeed={1}
            />
          </Canvas>
        </div>
        <div className="chat-indicator">
          <i className="fas fa-comments"></i>
          <span className="pulse-dot"></span>
        </div>
      </div>

      {/* Chat Container */}
      <div className={`chat-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-title">
            <div className="ai-avatar">
              <i className="fas fa-brain"></i>
            </div>
            <div>
              <h4>Cure AI Assistant</h4>
              <span className="status">Online</span>
            </div>
          </div>
          <button className="close-chat" onClick={toggleChat}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="chat-messages" ref={chatRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user' : 'ai'}`}
              data-aos={message.isUser ? 'fade-left' : 'fade-right'}
              data-aos-duration="500"
            >
              <div className="message-bubble">
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="input-container">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-input"
            />
            <button 
              onClick={sendMessage}
              className="send-button"
              disabled={!inputText.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// 3D Crystal Model Component
const CrystalModel: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      if (isOpen) {
        gsap.to(meshRef.current.scale, {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.5,
          ease: 'power2.out'
        });
        gsap.to(meshRef.current.rotation, {
          x: Math.PI * 0.5,
          y: Math.PI * 0.5,
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        gsap.to(meshRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
        gsap.to(meshRef.current.rotation, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    }
  }, [isOpen]);

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
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
      
      {/* Inner crystal */}
      <mesh scale={[0.6, 0.6, 0.6]}>
        <octahedronGeometry args={[1, 0]} />
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
        duration: 15,
        ease: 'none',
        repeat: -1
      });
    }
  }, []);

  const particles = React.useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
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
        size={0.01}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ChatInterface;