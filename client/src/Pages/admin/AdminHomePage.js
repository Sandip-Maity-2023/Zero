import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function AdminHomePage() {
  const { user } = useAuth();
  const [approvalsCount, setApprovalsCount] = useState(0);
  const [orgsCount, setOrgsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [approvalsRes, orgsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/approves`),
          axios.get(`${API_URL}/org`)
        ]);

        setApprovalsCount(approvalsRes.data?.length || 0);
        setOrgsCount(orgsRes.data?.length || 0);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Platform Administration</h2>
          <p className="page-subtitle">
            ZeroHunger Governance & Verification Console {user?.email && `• Logged in as ${user.email}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin-accept" className="btn btn-primary">
            Review Approvals
          </Link>
          <Link to="/admin-mgmt" className="btn btn-secondary">
            Manage Verified Orgs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">🛡️</div>
          <div>
            <div className="stat-value">{loading ? '...' : approvalsCount}</div>
            <div className="stat-label">Pending / Approved Records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🏛️</div>
          <div>
            <div className="stat-value">{loading ? '...' : orgsCount}</div>
            <div className="stat-label">Total Active Food Aid Postings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">🔒</div>
          <div>
            <div className="stat-value">Administrator</div>
            <div className="stat-label">Access Clearance</div>
          </div>
        </div>
      </div>

      {/* Admin Modules */}
      <div className="roles-grid">
        <div className="role-card">
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <h3>Registration Approvals</h3>
            <p>
              Review new organization registrations, verify charity licenses, and approve non-profit organizations into the network.
            </p>
          </div>
          <Link to="/admin-accept" className="btn btn-primary">
            Open Approvals Queue →
          </Link>
        </div>

        <div className="role-card">
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
            <h3>Organization Directory</h3>
            <p>
              Audit verified organizations, modify contact coordinates, or revoke credentials for non-compliant entities.
            </p>
          </div>
          <Link to="/admin-mgmt" className="btn btn-secondary">
            Manage Organizations →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
