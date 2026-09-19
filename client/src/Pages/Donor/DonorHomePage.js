import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function DonorHomePage() {
  const { user } = useAuth();
  const [openRequests, setOpenRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/org`);
        setOpenRequests(res.data || []);
      } catch (err) {
        console.error('Error fetching aid requests for donor:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const donorDisplayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.orgName || user.email?.split('@')[0]
    : 'Valued Donor';

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Donor Dashboard</h2>
          <p className="page-subtitle">
            Welcome, <strong>{donorDisplayName}</strong>. Empower communities by turning surplus food into nourishing meals.
          </p>
        </div>
        <Link to="/donor-accept-request" className="btn btn-primary">
          Browse Open Requests ({openRequests.length})
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">🎁</div>
          <div>
            <div className="stat-value">{loading ? '...' : openRequests.length}</div>
            <div className="stat-label">Urgent Community Needs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🍲</div>
          <div>
            <div className="stat-value">
              {openRequests.reduce((acc, curr) => acc + (parseInt(curr.population) || 0), 0)}
            </div>
            <div className="stat-label">People Awaiting Meals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">🚚</div>
          <div>
            <div className="stat-value">Volunteer Courier</div>
            <div className="stat-label">Free Pickup Available</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="action-banner">
        <div>
          <h2>Have Surplus Food or Prepared Meals?</h2>
          <p>Browse open requests from nearby community kitchens and pledge your donation in 60 seconds.</p>
        </div>
        <Link to="/donor-accept-request" className="btn">
          View Food Aid Requests →
        </Link>
      </div>

      {/* Urgent Requests Preview */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>
          Urgent Food Aid Requests Needing Donors
        </h3>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading available requests...</p>
        ) : openRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No Open Food Aid Requests Currently</h3>
            <p>Organizations have not posted any open requests at this moment. Check back soon!</p>
          </div>
        ) : (
          <div className="card-grid">
            {openRequests.slice(0, 3).map((req) => (
              <div className="item-card" key={req._id}>
                <div className="card-top-row">
                  <h4>{req.requestTitle}</h4>
                  <span className="role-badge donor">Needs Donor</span>
                </div>
                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Shelter/Org:</strong>
                    <span>{req.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Meals Required:</strong>
                    <span>{req.population} persons</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Needed By:</strong>
                    <span>{new Date(req.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Location:</strong>
                    <span>{req.orgLocation}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/donor-accept-request" className="btn btn-primary btn-sm">
                    Pledge Donation →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DonorHomePage;
