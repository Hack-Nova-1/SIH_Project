import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate header on mount
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    // Animate logo
    gsap.fromTo('.navbar-brand', 
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' }
    );

    // Animate nav items
    gsap.fromTo('.nav-item', 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.5 }
    );
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    
    if (!isMenuOpen) {
      gsap.fromTo('.mobile-menu', 
        { x: '100%', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      gsap.to('.mobile-menu', 
        { x: '100%', opacity: 0, duration: 0.3, ease: 'power3.in' }
      );
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="logo-container">
            <i className="fas fa-brain"></i>
            <span className="logo-text">Cure AI</span>
            <div className="logo-glow"></div>
          </div>
        </Link>

        <button 
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/emergency" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-ambulance"></i>
                <span>Emergency</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/subscription" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-crown"></i>
                <span>Premium</span>
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary-3d ms-3" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-comments"></i>
                <span>Start Chat</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h3>Cure AI</h3>
            <button className="close-btn" onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <ul className="mobile-nav">
            <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link to="/emergency" onClick={toggleMenu}>Emergency</Link></li>
            <li><Link to="/subscription" onClick={toggleMenu}>Premium</Link></li>
            <li><button className="btn btn-primary-3d w-100 mt-3">Start Chat</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;