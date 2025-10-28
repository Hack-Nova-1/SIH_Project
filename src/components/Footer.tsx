import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Animate footer entrance
    gsap.fromTo(footerRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Animate footer elements
    gsap.fromTo('.footer-section', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.2, delay: 1 }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-section">
              <div className="footer-brand">
                <div className="brand-logo">
                  <i className="fas fa-brain"></i>
                  <span>Cure AI</span>
                </div>
                <p className="brand-description">
                  Revolutionizing healthcare through AI-powered solutions. 
                  Connect with expert doctors, get instant medical guidance, 
                  and access emergency services through our immersive 3D platform.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="footer-title">Services</h5>
              <ul className="footer-links">
                <li><Link to="/">AI Health Assistant</Link></li>
                <li><Link to="/">Doctor Consultation</Link></li>
                <li><Link to="/emergency">Emergency Services</Link></li>
                <li><Link to="/subscription">Premium Plans</Link></li>
                <li><Link to="/">Health Analytics</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="footer-title">Company</h5>
              <ul className="footer-links">
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Our Team</Link></li>
                <li><Link to="/">Careers</Link></li>
                <li><Link to="/">Press</Link></li>
                <li><Link to="/">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links">
                <li><Link to="/">Help Center</Link></li>
                <li><Link to="/">Documentation</Link></li>
                <li><Link to="/">API Reference</Link></li>
                <li><Link to="/">Status</Link></li>
                <li><Link to="/">Report Bug</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="footer-title">Legal</h5>
              <ul className="footer-links">
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Terms of Service</Link></li>
                <li><Link to="/">Cookie Policy</Link></li>
                <li><Link to="/">GDPR</Link></li>
                <li><Link to="/">HIPAA</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="footer-bottom">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="footer-copyright">
                    <p>&copy; 2024 Cure AI. All rights reserved.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="footer-social">
                    <a href="#" className="social-link" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="YouTube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="footer-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </footer>
  );
};

export default Footer;