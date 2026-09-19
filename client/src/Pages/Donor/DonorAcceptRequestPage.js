import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function DonorAcceptRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donationMode, setDonationMode] = useState('direct'); // 'direct' | 'org-request'
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
    donationTitle: '',
    donationSize: '',
    deliveryMethod: 'volunteer-delivery',
    donorTelephone: '',
    donorLocation: '',
    donorOtherDetails: '',
    targetOrgName: 'Local Community Kitchens & Shelters'
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
    setDonationMode('org-request');
    setDonation((prev) => ({
      ...prev,
      donationTitle: `Food Aid for: ${req.requestTitle}`,
      targetOrgName: req.orgName
    }));
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value });
  };

  const handlePledgeDonation = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      let payload;

      if (donationMode === 'org-request' && selectedRequest) {
        payload = {
          orgId: selectedRequest._id,
          orgName: selectedRequest.orgName,
          requestTitle: selectedRequest.requestTitle,
          population: selectedRequest.population,
          dueDate: selectedRequest.dueDate,
          orgOtherDetails: selectedRequest.orgOtherDetails || 'None',
          orgLocation: selectedRequest.orgLocation,
          orgTelephone: Number(selectedRequest.orgTelephone) || 0,
          donorId: user?._id || 'donor-user',
          donorName: donation.donorName || 'Generous Donor',
          donationSize: donation.donationSize,
          deliveryMethod: donation.deliveryMethod,
          donorTelephone: Number(donation.donorTelephone),
          donorOtherDetails: donation.donorOtherDetails || 'None',
          donorLocation: donation.donorLocation,
          status: 'pending'
        };
      } else {
        // Direct Food Contribution
        payload = {
          orgId: 'open-community',
          orgName: donation.targetOrgName || 'Community Food Bank Hub',
          requestTitle: donation.donationTitle || `${donation.donationSize} Food Contribution`,
          population: '50',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          orgOtherDetails: 'Direct donor food contribution for distribution',
          orgLocation: 'Community Distribution Center',
          orgTelephone: 0,
          donorId: user?._id || 'donor-user',
          donorName: donation.donorName || 'Generous Donor',
          donationSize: donation.donationSize,
          deliveryMethod: donation.deliveryMethod,
          donorTelephone: Number(donation.donorTelephone),
          donorOtherDetails: donation.donorOtherDetails || 'None',
          donorLocation: donation.donorLocation,
          status: 'pending'
        };
      }

      await axios.post(`${API_URL}/donor`, payload);
      setMessage(
        `🎉 Thank you! Your donation of "${donation.donationSize}" has been pledged! ${
          donation.deliveryMethod === 'volunteer-delivery'
            ? 'A volunteer courier has been notified for pickup from your location.'
            : 'You can deliver the items directly to the center.'
        }`
      );
      setSelectedRequest(null);
      setDonation({
        donorName: defaultDonorName,
        donationTitle: '',
        donationSize: '',
        deliveryMethod: 'volunteer-delivery',
        donorTelephone: '',
        donorLocation: '',
        donorOtherDetails: '',
        targetOrgName: 'Local Community Kitchens & Shelters'
      });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit donation. Please verify required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Donate Food & Provide Aid</h2>
          <p className="page-subtitle">
            Pledge excess food, catering surplus, or sponsor a non-profit shelter's aid requirement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/donor-home" className="btn btn-secondary">
            ← Dashboard
          </Link>
          <Link to="/donor-mgmt" className="btn btn-primary">
            My Donations Tracker →
          </Link>
        </div>
      </div>

      {message && (
        <div className="alert-success">
          <span>✅</span> {message}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => navigate('/donor-mgmt')}
          >
            Track in My Donations →
          </button>
        </div>
      )}

      {error && (
        <div className="alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Donation Method Switcher */}
      <div className="role-switch-tabs" style={{ maxWidth: '600px', margin: '0 auto 28px' }}>
        <button
          type="button"
          className={`role-tab-btn ${donationMode === 'direct' ? 'active' : ''}`}
          onClick={() => {
            setDonationMode('direct');
            setSelectedRequest(null);
            setError('');
          }}
        >
          🎁 Direct Food Donation (Surplus Food)
        </button>
        <button
          type="button"
          className={`role-tab-btn ${donationMode === 'org-request' ? 'active' : ''}`}
          onClick={() => {
            setDonationMode('org-request');
            setError('');
          }}
        >
          🏛️ Sponsor an Organization's Request ({requests.length})
        </button>
      </div>

      {donationMode === 'direct' ? (
        /* Direct Food Donation Form */
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: '#ffffff',
            padding: '36px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🍲</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Direct Food Donation Pledge</h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
              Have fresh surplus food from a kitchen, restaurant, event, or store? Tell us what you have and our volunteer couriers will pick it up.
            </p>
          </div>

          <form onSubmit={handlePledgeDonation}>
            <div className="form-group">
              <label htmlFor="direct_donorName">Donor / Business / Kitchen Name</label>
              <input
                type="text"
                id="direct_donorName"
                name="donorName"
                value={donation.donorName}
                onChange={handleChange}
                placeholder="e.g. Green Deli & Bakery / John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="direct_donationTitle">Food Donation Title / Summary</label>
              <input
                type="text"
                id="direct_donationTitle"
                name="donationTitle"
                value={donation.donationTitle}
                onChange={handleChange}
                placeholder="e.g. 50 Fresh Hot Box Meals / 3 Crates of Fresh Apples"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="direct_donationSize">Quantity / Headcount Portion</label>
                <input
                  type="text"
                  id="direct_donationSize"
                  name="donationSize"
                  value={donation.donationSize}
                  onChange={handleChange}
                  placeholder="e.g. 50 servings / 20 kg"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direct_deliveryMethod">Fulfillment Mode</label>
                <select
                  id="direct_deliveryMethod"
                  name="deliveryMethod"
                  value={donation.deliveryMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="volunteer-delivery">Volunteer Courier Pickup (Free)</option>
                  <option value="self-delivery">Self Delivery to Local Hub</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="direct_donorTelephone">Contact Phone Number</label>
                <input
                  type="tel"
                  id="direct_donorTelephone"
                  name="donorTelephone"
                  value={donation.donorTelephone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direct_donorLocation">Pickup Address</label>
                <input
                  type="text"
                  id="direct_donorLocation"
                  name="donorLocation"
                  value={donation.donorLocation}
                  onChange={handleChange}
                  placeholder="e.g. 24 Market St, Kitchen Entrance"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="direct_donorOtherDetails">Food Storage / Handling Notes</label>
              <textarea
                id="direct_donorOtherDetails"
                name="donorOtherDetails"
                rows="2"
                value={donation.donorOtherDetails}
                onChange={handleChange}
                placeholder="e.g. Vegetarian, freshly prepared today at 11 AM, packed in heat-retaining containers."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={submitting} style={{ marginTop: '12px' }}>
              {submitting ? 'Confirming Donation...' : 'Pledge Food Donation →'}
            </button>
          </form>
        </div>
      ) : (
        /* Sponsor an Organization Request Layout */
        <div className="home-split">
          {/* Organization Requests List */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
              Select a Shelter / Kitchen to Sponsor ({requests.length})
            </h3>

            {loading ? (
              <p style={{ color: '#64748b' }}>Loading open requests...</p>
            ) : requests.length === 0 ? (
              <div className="empty-state">
                <h3>No Open Aid Requests</h3>
                <p>All current organization requests have been sponsored! You can make a direct food donation above.</p>
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
                          {isSelected ? '✓ Selected to Sponsor' : 'Needs Food'}
                        </span>
                      </div>

                      <div style={{ margin: '10px 0' }}>
                        <div className="card-detail-item">
                          <strong>Organization / Shelter:</strong>
                          <span>{request.orgName}</span>
                        </div>
                        <div className="card-detail-item">
                          <strong>Headcount Needed:</strong>
                          <span>{request.population} people</span>
                        </div>
                        <div className="card-detail-item">
                          <strong>Required By Date:</strong>
                          <span>{new Date(request.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="card-detail-item">
                          <strong>Delivery Location:</strong>
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
                          {isSelected ? 'Selected' : 'Sponsor This Request'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Donation Pledge Form for Selected Request */}
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
              {selectedRequest ? '🎁 Fulfill Aid Request' : '👈 Select an Org Request'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
              {selectedRequest
                ? `Donating to: ${selectedRequest.orgName} (${selectedRequest.requestTitle})`
                : 'Click "Sponsor This Request" on any posting on the left to configure your donation.'}
            </p>

            <form onSubmit={handlePledgeDonation}>
              <div className="form-group">
                <label htmlFor="donorName">Donor / Kitchen Name</label>
                <input
                  type="text"
                  id="donorName"
                  name="donorName"
                  value={donation.donorName}
                  onChange={handleChange}
                  placeholder="e.g. City Bakery / John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donationSize">Food Donation Items & Quantity</label>
                <input
                  type="text"
                  id="donationSize"
                  name="donationSize"
                  value={donation.donationSize}
                  onChange={handleChange}
                  placeholder="e.g. 150 Fresh Bento Lunch Boxes"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="deliveryMethod">Fulfillment Mode</label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={donation.deliveryMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="volunteer-delivery">Volunteer Courier Pickup (Free)</option>
                  <option value="self-delivery">Self Delivery to Shelter</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="donorTelephone">Contact Phone</label>
                <input
                  type="tel"
                  id="donorTelephone"
                  name="donorTelephone"
                  value={donation.donorTelephone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donorLocation">Your Pickup Location</label>
                <input
                  type="text"
                  id="donorLocation"
                  name="donorLocation"
                  value={donation.donorLocation}
                  onChange={handleChange}
                  placeholder="e.g. 100 Main St, Kitchen Entrance"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donorOtherDetails">Packaging & Pickup Instructions</label>
                <textarea
                  id="donorOtherDetails"
                  name="donorOtherDetails"
                  rows="2"
                  value={donation.donorOtherDetails}
                  onChange={handleChange}
                  placeholder="e.g. Ready for pickup by 11:30 AM in thermal containers."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={!selectedRequest || submitting}
                style={{ marginTop: '12px' }}
              >
                {submitting ? 'Confirming Donation...' : 'Pledge Donation →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorAcceptRequestPage;
