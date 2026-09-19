import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function VolunteerHomePage() {
  const { user } = useAuth();
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const volunteerId = user?._id || 'sampleVolunteerID';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [delivRes, myJobsRes] = await Promise.all([
          axios.get(`${API_URL}/donor/volunteer-delivery`),
          axios.get(`${API_URL}/volunteer/delivery-jobs/user-jobs/${volunteerId}`)
        ]);

        setAvailableDeliveries(delivRes.data || []);
        setMyJobs(myJobsRes.data || []);
      } catch (err) {
        console.error('Error fetching volunteer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [volunteerId]);

  const volunteerDisplayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.email?.split('@')[0]
    : 'Courier Hero';

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Volunteer Courier Dashboard</h2>
          <p className="page-subtitle">
            Welcome, <strong>{volunteerDisplayName}</strong>. Thank you for connecting donors and hungry communities.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/volunteer-delivery-accept" className="btn btn-primary">
            Accept Deliveries ({availableDeliveries.length})
          </Link>
          <Link to="/volunteer-mgmt" className="btn btn-secondary">
            My Active Jobs ({myJobs.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">🚴</div>
          <div>
            <div className="stat-value">{loading ? '...' : availableDeliveries.length}</div>
            <div className="stat-label">Available Deliveries Needing Couriers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-amber">📦</div>
          <div>
            <div className="stat-value">{loading ? '...' : myJobs.length}</div>
            <div className="stat-label">My Active Transport Missions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-purple">🌟</div>
          <div>
            <div className="stat-value">Community Hero</div>
            <div className="stat-label">Courier Badge</div>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="action-banner">
        <div>
          <h2>Ready to hit the road?</h2>
          <p>Browse pending donor pickups and help transport hot meals and groceries to receiving centers.</p>
        </div>
        <Link to="/volunteer-delivery-accept" className="btn">
          View Delivery Jobs →
        </Link>
      </div>

      {/* Available Deliveries Preview */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>
          Urgent Food Deliveries Awaiting Couriers
        </h3>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading delivery opportunities...</p>
        ) : availableDeliveries.length === 0 ? (
          <div className="empty-state">
            <h3>No Deliveries Waiting Right Now</h3>
            <p>Great job! All current donations have been claimed by couriers. Check back soon for new postings.</p>
          </div>
        ) : (
          <div className="card-grid">
            {availableDeliveries.slice(0, 3).map((job) => (
              <div className="item-card" key={job._id}>
                <div className="card-top-row">
                  <h4>{job.requestTitle}</h4>
                  <span className="role-badge volunteer">Needs Courier</span>
                </div>
                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Pickup From (Donor):</strong>
                    <span>{job.donorName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Pickup Address:</strong>
                    <span>{job.donorLocation}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Deliver To (Org):</strong>
                    <span>{job.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Drop-off Address:</strong>
                    <span>{job.orgLocation}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Cargo Size:</strong>
                    <span>{job.donationSize}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/volunteer-delivery-accept" className="btn btn-primary btn-sm">
                    Accept Job →
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

export default VolunteerHomePage;