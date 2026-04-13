import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">Agri<span>Tech</span></div>
            <p>
              One platform connecting Farmers, Buyers, Agri-Vendors & Government —
              Built for Bharat. Empowering every farmer with technology.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              <span className="badge-pill">🇮🇳 Made in India</span>
              <span className="badge-pill">English · हिंदी · भोजपुरी</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/how-it-works">How It Works</NavLink>
            <NavLink to="/about">About Us</NavLink>
            <NavLink to="/privacy">Privacy Policy</NavLink>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:support@agritech.in">fasalrath@agritechiitbhu.in</a>
            <a href="tel:+911800AGRI">1800-AGRI-HELP</a>
            <a href="#">Download App</a>
            <a href="#">Report an Issue</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AgriTech. All rights reserved.</span>
          <div className="footer-badges">
            <span className="badge-pill">Govt. Integrated</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
