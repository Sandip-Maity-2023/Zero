import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function DonorHomePage() {
  const { user } = useAuth();
  const donorId = user?._id || 'sampleDonorID';

  const [openRequests, setOpenRequests] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorDashboard = async () => {
      try {
        const [requestsRes, myDonationsRes] = await Promise.all([
          axios.get(`${API_URL}/org`),
          axios.get(`${API_URL}/donor/user-donations/${donorId}`)
        ]);

        setOpenRequests(requestsRes.data || []);
        setMyDonations(myDonationsRes.data || []);
      } catch (err) {
        console.error('Error loading donor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorDashboard();
  }, [donorId]);

  const donorDisplayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.orgName || user.email?.split('@')[0]
    : 'Valued Food Donor';

  const activeDonationsCount = myDonations.filter((d) => d.status !== 'delivered').length;

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Donor Hub & Impact Dashboard</h2>
          <p className="page-subtitle">
            Welcome, <strong>{donorDisplayName}</strong>. Turn surplus food and meals into direct community nourishment.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/donor-accept-request" className="btn btn-primary">
            + Donate Food Now
          </Link>
          <Link to="/donor-mgmt" className="btn btn-secondary">
            My Donations ({myDonations.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">🎁</div>
          <div>
            <div className="stat-value">{loading ? '...' : myDonations.length}</div>
            <div className="stat-label">Total Contributions Pledged</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🍲</div>
          <div>
            <div className="stat-value">
              {myDonations.reduce((acc, curr) => acc + (parseInt(curr.population) || 50), 0)}
            </div>
            <div className="stat-label">Community Members Nourished</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">🚚</div>
          <div>
            <div className="stat-value">{loading ? '...' : activeDonationsCount}</div>
            <div className="stat-label">Active Transports In Progress</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="action-banner">
        <div>
          <h2>Have Prepared Food or Groceries to Donate?</h2>
          <p>
            Whether fulfilling a shelter's request or donating excess inventory from your kitchen, you can pledge food in under 2 minutes. Free volunteer pickup available.
          </p>
        </div>
        <Link to="/donor-accept-request" className="btn">
          Donate Food Today →
        </Link>
      </div>

      {/* Section 1: My Recent Donations Live Tracker */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            My Active Donations Tracker
          </h3>
          <Link to="/donor-mgmt" style={{ color: '#059669', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' }}>
            View Full Tracking History →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading your contributions...</p>
        ) : myDonations.length === 0 ? (
          <div className="empty-state">
            <h3>No Active Food Donations</h3>
            <p>You haven't made a food donation yet. Make your first pledge today to help families in need.</p>
            <Link to="/donor-accept-request" className="btn btn-primary">
              + Pledge Your First Donation
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {myDonations.slice(0, 3).map((item) => (
              <div className="item-card" key={item._id}>
                <div className="card-top-row">
                  <h4>{item.requestTitle}</h4>
                  {item.status === 'in-transit' ? (
                    <span className="role-badge volunteer">🚚 Courier Assigned</span>
                  ) : item.status === 'delivered' ? (
                    <span className="role-badge organization">✅ Delivered</span>
                  ) : (
                    <span className="role-badge donor">⏳ Awaiting Courier</span>
                  )}
                </div>

                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Quantity / Items:</strong>
                    <span style={{ color: '#059669', fontWeight: '700' }}>{item.donationSize}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Recipient Shelter:</strong>
                    <span>{item.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Pickup Address:</strong>
                    <span>{item.donorLocation}</span>
                  </div>
                  {item.status === 'in-transit' && item.volunteerName && (
                    <div className="card-detail-item" style={{ background: '#ecfdf5', padding: '6px 8px', borderRadius: '6px' }}>
                      <strong>Courier Driver:</strong>
                      <span style={{ color: '#065f46' }}>{item.volunteerName}</span>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <Link to="/donor-mgmt" className="btn btn-secondary btn-sm">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Community Food Requests Needing Donors */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>
          Urgent Shelter Requests Awaiting Donors
        </h3>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading community requests...</p>
        ) : openRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No Pending Shelter Requests</h3>
            <p>All current organization requests have been fulfilled! You can still make a direct food donation.</p>
            <Link to="/donor-accept-request" className="btn btn-primary">
              Make Direct Food Donation
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {openRequests.slice(0, 3).map((req) => (
              <div className="item-card" key={req._id}>
                <div className="card-top-row">
                  <h4>{req.requestTitle}</h4>
                  <span className="role-badge donor">Needs Sponsor</span>
                </div>
                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Shelter/Org:</strong>
                    <span>{req.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Headcount:</strong>
                    <span>{req.population} persons</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Needed By:</strong>
                    <span>{new Date(req.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Destination:</strong>
                    <span>{req.orgLocation}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/donor-accept-request" className="btn btn-primary btn-sm">
                    Donate to Fulfill This →
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
