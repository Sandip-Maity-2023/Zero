import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LandingPage() {
  const { isAuthenticated, role, getRoleHome } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>🎯</span> UN SDG Goal 2: Zero Hunger & Sustainable Food Distribution
        </div>
        <h1 className="hero-title">
          Connecting Surplus Food with <span>Communities in Need</span>
        </h1>
        <p className="hero-lead">
          A unified collaborative platform bridging non-profits, generous donors, and volunteer couriers to eliminate hunger and reduce food waste.
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to={getRoleHome(role)} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              Go to Your Dashboard ({role.toUpperCase()}) →
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Join the Mission (Sign Up)
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
                Sign In to Platform
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Impact Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🍲</div>
          <div>
            <div className="stat-value">12,450+</div>
            <div className="stat-label">Meals Provided</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">🏛️</div>
          <div>
            <div className="stat-value">85+</div>
            <div className="stat-label">Community Organizations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">🚴</div>
          <div>
            <div className="stat-value">320+</div>
            <div className="stat-label">Volunteer Couriers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">🤝</div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Community Driven</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="action-banner">
        <div>
          <h2>Need Emergency Food Aid for Your Community?</h2>
          <p>Register your non-profit, shelter, or community pantry to publish requests for daily food aid.</p>
        </div>
        <Link to="/signup" className="btn">
          Register Organization
        </Link>
      </div>

      {/* Role Pillars */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
          How the ZeroHunger Ecosystem Operates
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '32px' }}>
          Three coordinated roles working together seamlessly in real-time
        </p>

        <div className="roles-grid">
          <div className="role-card">
            <div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🏛️</div>
              <h3>For Organizations</h3>
              <p>
                Community pantries, orphanages, and shelters can create food aid requests detailing headcount, dietary needs, location, and required dates.
              </p>
            </div>
            <Link to="/signup" className="btn btn-secondary btn-full">
              Sign Up as Organization →
            </Link>
          </div>

          <div className="role-card">
            <div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🎁</div>
              <h3>For Donors</h3>
              <p>
                Restaurants, caterers, groceries, and individuals can browse open community requests and pledge hot meals, produce, or dry rations.
              </p>
            </div>
            <Link to="/signup" className="btn btn-secondary btn-full">
              Sign Up as Donor →
            </Link>
          </div>

          <div className="role-card">
            <div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>🚴</div>
              <h3>For Volunteers</h3>
              <p>
                Volunteer drivers and cyclists accept delivery jobs to transport donated food from donor kitchens directly to receiving organizations.
              </p>
            </div>
            <Link to="/signup" className="btn btn-secondary btn-full">
              Sign Up as Volunteer →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;