import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function OrganizationHomePage() {
  const { user } = useAuth();
  const [requestCount, setRequestCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/org`);
        const allRequests = response.data || [];
        // Filter requests belonging to this org if orgId or orgName matches, or show all
        const myRequests = allRequests.filter(
          (r) => r.orgId === user?._id || r.orgName === user?.orgName
        );
        const displayRequests = myRequests.length > 0 ? myRequests : allRequests;
        setRequestCount(displayRequests.length);
        setRecentRequests(displayRequests.slice(0, 3));
      } catch (err) {
        console.error('Error fetching org requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const orgDisplayName = user?.orgName || 'Partner Organization';

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Organization Dashboard</h2>
          <p className="page-subtitle">
            Welcome, <strong>{orgDisplayName}</strong> {user?.registrationNo && `(Reg: ${user.registrationNo})`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/foodaidrequest" className="btn btn-primary">
            + New Aid Request
          </Link>
          <Link to="/organization-mgmt" className="btn btn-secondary">
            Manage All ({requestCount})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">📋</div>
          <div>
            <div className="stat-value">{loading ? '...' : requestCount}</div>
            <div className="stat-label">Active Food Aid Requests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">👥</div>
          <div>
            <div className="stat-value">
              {recentRequests.reduce((acc, curr) => acc + (parseInt(curr.population) || 0), 0)}
            </div>
            <div className="stat-label">Estimated People Served</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">🤝</div>
          <div>
            <div className="stat-value">Verified</div>
            <div className="stat-label">Organization Status</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="roles-grid" style={{ marginBottom: '40px' }}>
        <div className="role-card">
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
            <h3>Request Food Aid</h3>
            <p>
              Publish a new urgent or scheduled food aid request with details on headcount, delivery location, and dietary specifications.
            </p>
          </div>
          <Link to="/foodaidrequest" className="btn btn-primary">
            Create Request Form →
          </Link>
        </div>

        <div className="role-card">
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📦</div>
            <h3>Manage & Track Requests</h3>
            <p>
              Review your existing food aid postings, see if donors have pledged supplies, update details, or close completed requests.
            </p>
          </div>
          <Link to="/organization-mgmt" className="btn btn-secondary">
            View Requests List →
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Recent Postings</h3>
        {loading ? (
          <p style={{ color: '#64748b' }}>Loading requests...</p>
        ) : recentRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No Food Aid Requests Yet</h3>
            <p>Create your first request so local donors and volunteers can offer assistance.</p>
            <Link to="/foodaidrequest" className="btn btn-primary">
              + Post First Request
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {recentRequests.map((req) => (
              <div className="item-card" key={req._id}>
                <div className="card-top-row">
                  <h4>{req.requestTitle}</h4>
                  <span className="role-badge organization">Open</span>
                </div>
                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Target Headcount:</strong>
                    <span>{req.population} persons</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Due Date:</strong>
                    <span>{new Date(req.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Location:</strong>
                    <span>{req.orgLocation}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/organization-mgmt" className="btn btn-secondary btn-sm">
                    Manage →
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

export default OrganizationHomePage;
