import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function DonorMgmtPage() {
  const { user } = useAuth();
  const donorId = user?._id || 'sampleDonorID';

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/donor/user-donations/${donorId}`);
      if (response.data && response.data.length > 0) {
        setDonations(response.data);
      } else {
        // Fall back to all donations filtered by donorId or donorName
        const allRes = await axios.get(`${API_URL}/donor`);
        const myItems = (allRes.data || []).filter(
          (d) => d.donorId === donorId || d.donorName === user?.firstName || d.donorName === user?.orgName
        );
        setDonations(myItems.length > 0 ? myItems : allRes.data || []);
      }
    } catch (err) {
      console.error('Error fetching donor contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorId]);

  const handleCancelDonation = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel donation "${title}"?`)) return;

    try {
      await axios.delete(`${API_URL}/donor/${id}`);
      setMessage(`Donation cancelled.`);
      setTimeout(() => setMessage(''), 4000);
      fetchMyDonations();
    } catch (err) {
      setError('Failed to cancel donation. It may already be in transit.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-transit':
        return <span className="role-badge volunteer">🚚 Courier En Route</span>;
      case 'delivered':
        return <span className="role-badge organization">✅ Delivered</span>;
      default:
        return <span className="role-badge donor">⏳ Awaiting Courier Pickup</span>;
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">My Donations & Impact Tracker</h2>
          <p className="page-subtitle">Track your food donations, see courier pickup status, and view delivery progress.</p>
        </div>
        <Link to="/donor-accept-request" className="btn btn-primary">
          + Donate More Food
        </Link>
      </div>

      {message && (
        <div className="alert-success">
          <span>✅</span> {message}
        </div>
      )}

      {error && (
        <div className="alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Loading your donation contributions...
        </div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎁</div>
          <h3>No Food Donations Yet</h3>
          <p>You haven't made any food contributions yet. Browse community needs or make a direct food donation.</p>
          <Link to="/donor-accept-request" className="btn btn-primary">
            Pledge a Food Donation
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {donations.map((item) => (
            <div className="item-card" key={item._id}>
              <div>
                <div className="card-top-row">
                  <h4>{item.requestTitle}</h4>
                  {getStatusBadge(item.status)}
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div className="card-detail-item">
                    <strong>Food / Quantity:</strong>
                    <span style={{ color: '#059669', fontWeight: '700' }}>{item.donationSize}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Recipient Org / Shelter:</strong>
                    <span>{item.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Delivery Method:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{item.deliveryMethod?.replace('-', ' ')}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Your Pickup Location:</strong>
                    <span>{item.donorLocation}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Date Pledged:</strong>
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  {/* Courier Assignment Box if In-Transit */}
                  {item.status === 'in-transit' && (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '8px', marginTop: '12px' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                        🚴 Assigned Volunteer Courier
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#065f46' }}>
                        {item.volunteerName || 'Volunteer Driver'}
                      </div>
                      {item.volunteerTelephoneNo && (
                        <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                          Phone: <a href={`tel:${item.volunteerTelephoneNo}`} style={{ color: '#059669', fontWeight: '600' }}>{item.volunteerTelephoneNo}</a>
                        </div>
                      )}
                      {item.vehicleNo && (
                        <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                          Vehicle: {item.vehicleNo}
                        </div>
                      )}
                    </div>
                  )}

                  {item.donorOtherDetails && item.donorOtherDetails !== 'None' && (
                    <div className="card-detail-item" style={{ marginTop: '8px' }}>
                      <strong>Pickup Notes:</strong>
                      <span style={{ maxWidth: '60%', textAlign: 'right' }}>{item.donorOtherDetails}</span>
                    </div>
                  )}
                </div>
              </div>

              {item.status === 'pending' && (
                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelDonation(item._id, item.requestTitle)}
                  >
                    Cancel Donation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DonorMgmtPage;
