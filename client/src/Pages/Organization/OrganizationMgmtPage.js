import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function OrganizationMgmtPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/org`);
      setRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`${API_URL}/org/${id}`);
      setMessage(`Successfully deleted request "${title}".`);
      setTimeout(() => setMessage(''), 4000);
      fetchRequests();
    } catch (err) {
      alert('Unable to delete request. Please try again.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Manage Food Aid Requests</h2>
          <p className="page-subtitle">
            Showing requests for <strong>{user?.orgName || 'all partner organizations'}</strong>.
          </p>
        </div>
        <Link to="/foodaidrequest" className="btn btn-primary">
          + Create New Request
        </Link>
      </div>

      {message && (
        <div className="alert-success">
          <span>✅</span> {message}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Loading food aid requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3>No Aid Requests Found</h3>
          <p>You haven't posted any food aid requests yet. Get started by posting an urgent food requirement.</p>
          <Link to="/foodaidrequest" className="btn btn-primary">
            + Post Aid Request
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {requests.map((request) => (
            <div className="item-card" key={request._id}>
              <div>
                <div className="card-top-row">
                  <h4>{request.requestTitle}</h4>
                  <span className="role-badge organization">Open Request</span>
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div className="card-detail-item">
                    <strong>Organization:</strong>
                    <span>{request.orgName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Headcount:</strong>
                    <span>{request.population} people</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Required By:</strong>
                    <span>{new Date(request.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Destination:</strong>
                    <span>{request.orgLocation}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Contact Phone:</strong>
                    <span>
                      <a href={`tel:${request.orgTelephone}`} style={{ color: '#059669', textDecoration: 'none' }}>
                        {request.orgTelephone}
                      </a>
                    </span>
                  </div>
                  {request.orgOtherDetails && (
                    <div className="card-detail-item">
                      <strong>Notes:</strong>
                      <span style={{ maxWidth: '60%', textAlign: 'right' }}>{request.orgOtherDetails}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteRequest(request._id, request.requestTitle)}
                >
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizationMgmtPage;
