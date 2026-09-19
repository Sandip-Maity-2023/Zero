import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function DonorAcceptRequestPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const defaultDonorName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.orgName || ''
    : '';

  const [donation, setDonation] = useState({
    donorName: defaultDonorName,
    donationSize: '',
    deliveryMethod: 'volunteer-delivery',
    donorTelephone: '',
    donorLocation: '',
    donorOtherDetails: ''
  });

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
    setMessage('');
    setError('');
    // Scroll form into view if on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value });
  };

  const handlePledgeDonation = async (e) => {
    e.preventDefault();
    if (!selectedRequest) {
      setError('Please select an aid request from the list first.');
      return;
    }

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const payload = {
        orgId: selectedRequest._id,
        orgName: selectedRequest.orgName,
        requestTitle: selectedRequest.requestTitle,
        population: selectedRequest.population,
        dueDate: selectedRequest.dueDate,
        orgOtherDetails: selectedRequest.orgOtherDetails || 'None',
        orgLocation: selectedRequest.orgLocation,
        orgTelephone: Number(selectedRequest.orgTelephone),
        donorId: user?._id || 'donor-user',
        donorName: donation.donorName || 'Generous Donor',
        donationSize: donation.donationSize,
        deliveryMethod: donation.deliveryMethod,
        donorTelephone: Number(donation.donorTelephone),
        donorOtherDetails: donation.donorOtherDetails || 'None',
        donorLocation: donation.donorLocation
      };

      await axios.post(`${API_URL}/donor`, payload);
      setMessage(
        `Donation successfully pledged for "${selectedRequest.requestTitle}"! If volunteer delivery was selected, local volunteer drivers will be notified for pickup.`
      );
      setSelectedRequest(null);
      setDonation({
        donorName: defaultDonorName,
        donationSize: '',
        deliveryMethod: 'volunteer-delivery',
        donorTelephone: '',
        donorLocation: '',
        donorOtherDetails: ''
      });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit donation pledge. Please check form fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Pledge Food Donation</h2>
          <p className="page-subtitle">Select an open request and provide food supplies for community members in need.</p>
        </div>
        <Link to="/donor-home" className="btn btn-secondary">
          ← Back to Dashboard
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

      <div className="home-split">
        {/* Left Side: Open Requests List */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
            Open Community Food Aid Requests ({requests.length})
          </h3>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading available requests...</p>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <h3>No Open Requests</h3>
              <p>All current aid requests have been addressed or none have been published yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map((request) => {
                const isSelected = selectedRequest?._id === request._id;
                return (
                  <div
                    className="item-card"
                    key={request._id}
                    style={{
                      border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff'
                    }}
                  >
                    <div className="card-top-row">
                      <h4>{request.requestTitle}</h4>
                      <span className={`role-badge ${isSelected ? 'organization' : 'donor'}`}>
                        {isSelected ? 'Selected' : 'Needs Aid'}
                      </span>
                    </div>

                    <div style={{ margin: '10px 0' }}>
                      <div className="card-detail-item">
                        <strong>Organization:</strong>
                        <span>{request.orgName}</span>
                      </div>
                      <div className="card-detail-item">
                        <strong>Headcount Needed:</strong>
                        <span>{request.population} persons</span>
                      </div>
                      <div className="card-detail-item">
                        <strong>Required Date:</strong>
                        <span>{new Date(request.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="card-detail-item">
                        <strong>Destination Address:</strong>
                        <span>{request.orgLocation}</span>
                      </div>
                      {request.orgOtherDetails && (
                        <div className="card-detail-item">
                          <strong>Dietary Notes:</strong>
                          <span style={{ maxWidth: '60%', textAlign: 'right' }}>{request.orgOtherDetails}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                        onClick={() => handleSelectRequest(request)}
                      >
                        {isSelected ? '✓ Selected' : 'Select to Donate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Donation Pledge Form */}
        <div
          style={{
            background: '#ffffff',
            padding: '28px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: '90px'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>
            {selectedRequest ? '🎁 Pledge Donation' : '👈 Select an Aid Request'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
            {selectedRequest
              ? `Donating for: ${selectedRequest.requestTitle} (${selectedRequest.orgName})`
              : 'Click "Select to Donate" on any request on the left to configure your pledge.'}
          </p>

          <form onSubmit={handlePledgeDonation}>
            <div className="form-group">
              <label htmlFor="donorName">Donor / Kitchen / Business Name</label>
              <input
                type="text"
                id="donorName"
                name="donorName"
                value={donation.donorName}
                onChange={handleChange}
                placeholder="e.g. Green Bakery & Cafe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="donationSize">Donation Quantity / Size</label>
              <input
                type="text"
                id="donationSize"
                name="donationSize"
                value={donation.donationSize}
                onChange={handleChange}
                placeholder="e.g. 100 Fresh Meal Boxes / 3 Crates Apples"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deliveryMethod">Fulfillment / Delivery Method</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={donation.deliveryMethod}
                onChange={handleChange}
                required
              >
                <option value="volunteer-delivery">Request Volunteer Courier Pickup</option>
                <option value="self-delivery">Self Delivery directly to Organization</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="donorTelephone">Contact Telephone</label>
              <input
                type="tel"
                id="donorTelephone"
                name="donorTelephone"
                value={donation.donorTelephone}
                onChange={handleChange}
                placeholder="e.g. 9123456780"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="donorLocation">Donor Pickup Location</label>
              <input
                type="text"
                id="donorLocation"
                name="donorLocation"
                value={donation.donorLocation}
                onChange={handleChange}
                placeholder="e.g. 12 Market Street, Bakery Back Entrance"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="donorOtherDetails">Pickup Instructions / Storage Notes</label>
              <textarea
                id="donorOtherDetails"
                name="donorOtherDetails"
                rows="2"
                value={donation.donorOtherDetails}
                onChange={handleChange}
                placeholder="e.g. Packed in insulated containers. Ready by 11:30 AM."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={!selectedRequest || submitting}
              style={{ marginTop: '12px' }}
            >
              {submitting ? 'Submitting Pledge...' : 'Confirm & Pledge Donation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DonorAcceptRequestPage;
