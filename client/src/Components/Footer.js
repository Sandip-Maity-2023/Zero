import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-row">
            <div className="footer-brand-icon">🌱</div>
            <span className="footer-brand-name">ZeroHunger</span>
          </div>
          <p className="footer-tagline">
            Connecting donors, volunteers &amp; organisations to fight food
            insecurity. Aligned with <strong>UN SDG 2 — Zero Hunger</strong>.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Platform</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Roles</h4>
          <ul className="footer-links">
            <li><span>Donor</span></li>
            <li><span>Volunteer</span></li>
            <li><span>Organisation</span></li>
            <li><span>Admin</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">About</h4>
          <ul className="footer-links">
            <li><a href="https://sdgs.un.org/goals/goal2" target="_blank" rel="noreferrer">UN SDG 2</a></li>
            <li><a href="https://www.fao.org" target="_blank" rel="noreferrer">FAO</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} ZeroHunger. All rights reserved.</span>
        <span className="footer-bottom-right">Built to end hunger, one delivery at a time 🍽️</span>
      </div>
    </footer>
  );
};

export default Footer;
