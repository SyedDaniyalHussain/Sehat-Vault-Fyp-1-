import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  // If already authenticated, bypass landing page and go to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-page">
      <header className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">🛡️ Sehat Vault v1.0 (FYP-1)</div>
          <h1 className="hero-title">
            Securely manage and organize your <span className="highlight">medical reports</span>.
          </h1>
          <p className="hero-subtitle">
            An encrypted repository for digital medical documents. Instantly upload PDFs, extract report contents, search metadata, and maintain your complete medical archive in one clean, unified space.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Access Account
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3 className="feature-heading">PDF Document Vault</h3>
            <p className="feature-text">
              Store original copies of lab tests, scan summaries, and prescriptions securely under your authenticated profile.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-heading">Automated Extraction</h3>
            <p className="feature-text">
              Original PDF and image files are stored in their original format for secure record keeping.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-heading">Privacy Protected</h3>
            <p className="feature-text">
              Session-bound authorization and ownership checks ensure only you can access, read, or delete your files.
            </p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Sehat Vault. Created for FYP-1. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
