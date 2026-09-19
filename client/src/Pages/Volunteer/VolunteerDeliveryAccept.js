import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function VolunteerDeliveryAccept() {
  const { user } = useAuth();
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const defaultVolunteerName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ''}`.trim()
      : user.email?.split('@')[0] || ''
    : '';

  const [volunteerDetails, setVolunteerDetails] = useState({
    volunteerName: defaultVolunteerName,
    NIC: '',
    vehicleNo: '',
    volunteerTelephoneNo: ''
  });

  const fetchDeliveryRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/donor/volunteer-delivery`);
      setDeliveryRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching volunteer delivery jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryRequests();
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVolunteerDetails({ ...volunteerDetails, [name]: value });
  };

  const handleAcceptDelivery = async (e) => {
    e.preventDefault();
    if (!selectedJob) {
      setError('Please select a delivery request from the list first.');
      return;
    }

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const payload = {
        orgId: selectedJob.orgId,
        orgName: selectedJob.orgName,
        requestTitle: selectedJob.requestTitle,
        population: selectedJob.population,
        dueDate: selectedJob.dueDate,
        orgOtherDetails: selectedJob.orgOtherDetails || 'None',
        orgLocation: selectedJob.orgLocation,
        orgTelephone: Number(selectedJob.orgTelephone),
        donorId: selectedJob.donorId,
        donorName: selectedJob.donorName,
        donationSize: selectedJob.donationSize,
        deliveryMethod: selectedJob.deliveryMethod,
        donorTelephone: Number(selectedJob.donorTelephone),
        donorOtherDetails: selectedJob.donorOtherDetails || 'None',
        donorLocation: selectedJob.donorLocation,
        volunteerId: user?._id || 'volunteer-user',
        volunteerName: volunteerDetails.volunteerName,
        NIC: volunteerDetails.NIC,
        vehicleNo: volunteerDetails.vehicleNo,
        volunteerTelephoneNo: Number(volunteerDetails.volunteerTelephoneNo)
      };

      // 1. Create the delivery job under volunteer deliveries
      await axios.post(`${API_URL}/volunteer/delivery-jobs`, payload);

      // 2. Remove the claimed donation from the open donor pool
      await axios.delete(`${API_URL}/donor/${selectedJob._id}`);

      setMessage(
        `Successfully accepted delivery mission for "${selectedJob.requestTitle}"! Check "My Deliveries" to track pickup and dropoff details.`
      );
      setSelectedJob(null);
      setVolunteerDetails({
        volunteerName: defaultVolunteerName,
        NIC: '',
        vehicleNo: '',
        volunteerTelephoneNo: ''
      });
      fetchDeliveryRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept delivery job. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Accept Volunteer Delivery Jobs</h2>
          <p className="page-subtitle">Transport pledged food donations from donors directly to waiting organizations.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/volunteer-home" className="btn btn-secondary">
            ← Dashboard
          </Link>
          <Link to="/volunteer-mgmt" className="btn btn-primary">
            My Deliveries →
          </Link>
        </div>
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
        {/* Available Requests List */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
            Open Deliveries Awaiting Couriers ({deliveryRequests.length})
          </h3>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading delivery opportunities...</p>
          ) : deliveryRequests.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
              <h3>All Deliveries Assigned!</h3>
              <p>There are no unassigned food deliveries right now. Check back soon or visit your active missions.</p>
              <Link to="/volunteer-mgmt" className="btn btn-secondary">
                View My Active Missions
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deliveryRequests.map((job) => {
                const isSelected = selectedJob?._id === job._id;
                return (
                  <div
                    className="item-card"
                    key={job._id}
                    style={{
                      border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff'
                    }}
                  >
                    <div className="card-top-row">
                      <h4>{job.requestTitle}</h4>
                      <span className={`role-badge ${isSelected ? 'volunteer' : 'donor'}`}>
                        {isSelected ? 'Selected' : 'Needs Courier'}
                      </span>
                    </div>

                    <div style={{ margin: '10px 0' }}>
                      <div className="card-detail-item">
                        <strong>Pickup From (Donor):</strong>
                        <span>{job.donorName}</span>
                      </div>
                      <div className="card-detail-item">
                        <strong>Pickup Address:</strong>
                        <span>{job.donorLocation}</span>
                      </div>
                      <div className="card-detail-item">
                        <strong>Donor Phone:</strong>
                        <span>{job.donorTelephone}</span>
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
                      {job.donorOtherDetails && (
                        <div className="card-detail-item">
                          <strong>Donor Notes:</strong>
                          <span style={{ maxWidth: '60%', textAlign: 'right' }}>{job.donorOtherDetails}</span>
                        </div>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                        onClick={() => handleSelectJob(job)}
                      >
                        {isSelected ? '✓ Selected' : 'Select Delivery Job'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Courier Acceptance Form */}
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
            {selectedJob ? '🚴 Accept Delivery Mission' : '👈 Select a Delivery Job'}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
            {selectedJob
              ? `Delivering: ${selectedJob.requestTitle} (${selectedJob.donationSize})`
              : 'Click "Select Delivery Job" on any posting to register as the courier.'}
          </p>

          <form onSubmit={handleAcceptDelivery}>
            <div className="form-group">
              <label htmlFor="volunteerName">Volunteer Courier Full Name</label>
              <input
                type="text"
                id="volunteerName"
                name="volunteerName"
                value={volunteerDetails.volunteerName}
                onChange={handleInputChange}
                placeholder="e.g. Alex Morgan"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="NIC">National Identity Card (NIC) / ID No.</label>
              <input
                type="text"
                id="NIC"
                name="NIC"
                value={volunteerDetails.NIC}
                onChange={handleInputChange}
                placeholder="e.g. 981234567V / ID-5542"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleNo">Vehicle Model / Plate / Transport Mode</label>
              <input
                type="text"
                id="vehicleNo"
                name="vehicleNo"
                value={volunteerDetails.vehicleNo}
                onChange={handleInputChange}
                placeholder="e.g. Honda Civic ABC-1234 / Cargo Bike"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="volunteerTelephoneNo">Courier Phone Number</label>
              <input
                type="tel"
                id="volunteerTelephoneNo"
                name="volunteerTelephoneNo"
                value={volunteerDetails.volunteerTelephoneNo}
                onChange={handleInputChange}
                placeholder="e.g. 9876543210"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={!selectedJob || submitting}
              style={{ marginTop: '12px' }}
            >
              {submitting ? 'Confirming Mission...' : 'Confirm & Accept Delivery'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDeliveryAccept;
