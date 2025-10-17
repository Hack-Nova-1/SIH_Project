import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Effects } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import DoctorPanel from './components/DoctorPanel';
import EmergencyPage from './components/EmergencyPage';
import SubscriptionPage from './components/SubscriptionPage';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

// 3D Scene Components
import Scene3D from './components/3D/Scene3D';
import ParticleField from './components/3D/ParticleField';
import VolumetricFog from './components/3D/VolumetricFog';

// Styles
import './App.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <LoadingScreen />
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <DoctorPanel />
                <ChatInterface />
              </>
            } />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Global 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance",
              physicallyCorrectLights: true
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <Scene3D />
              <ParticleField />
              <VolumetricFog />
              
              <Environment preset="night" />
              <OrbitControls 
                enablePan={false} 
                enableZoom={false} 
                enableRotate={false}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
              
              <Effects>
                <EffectComposer>
                  <Bloom
                    intensity={1.5}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={0.9}
                    blendFunction={BlendFunction.ADD}
                  />
                  <ChromaticAberration
                    offset={[0.001, 0.001]}
                    blendFunction={BlendFunction.NORMAL}
                  />
                  <Noise
                    opacity={0.02}
                    blendFunction={BlendFunction.OVERLAY}
                  />
                </EffectComposer>
              </Effects>
            </Suspense>
          </Canvas>
        </div>
      </div>
    </Router>
  );
}

export default App;