import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function VolunteerMgmt() {
  const { user } = useAuth();
  const volunteerId = user?._id || 'sampleVolunteerID';

  const [volunteerJobs, setVolunteerJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    volunteerName: '',
    NIC: '',
    vehicleNo: '',
    volunteerTelephoneNo: ''
  });

  const fetchVolunteerJobs = async () => {
    setLoading(true);
    try {
      // First try fetching jobs for this specific volunteer
      const response = await axios.get(`${API_URL}/volunteer/delivery-jobs/user-jobs/${volunteerId}`);
      if (response.data && response.data.length > 0) {
        setVolunteerJobs(response.data);
      } else {
        // Fall back to all volunteer jobs if specific user has none or if using legacy records
        const allResponse = await axios.get(`${API_URL}/volunteer/delivery-jobs`);
        setVolunteerJobs(allResponse.data || []);
      }
    } catch (err) {
      console.error('Error fetching volunteer jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volunteerId]);

  // Decline Delivery: removes from volunteer jobs and re-posts back to donor pool
  const handleDeclineDelivery = async (job) => {
    if (!window.confirm(`Are you sure you want to release delivery for "${job.requestTitle}" back to the community pool?`)) {
      return;
    }

    try {
      // 1. Delete the volunteer job
      await axios.delete(`${API_URL}/volunteer/delivery-jobs/${job._id}`);

      // 2. Re-post the donation back into the donor pool
      const repostDonation = {
        orgId: job.orgId,
        orgName: job.orgName,
        requestTitle: job.requestTitle,
        population: job.population,
        dueDate: job.dueDate,
        orgOtherDetails: job.orgOtherDetails,
        orgLocation: job.orgLocation,
        orgTelephone: Number(job.orgTelephone),
        donorId: job.donorId,
        donorName: job.donorName,
        donationSize: job.donationSize,
        deliveryMethod: job.deliveryMethod,
        donorTelephone: Number(job.donorTelephone),
        donorOtherDetails: job.donorOtherDetails,
        donorLocation: job.donorLocation
      };

      await axios.post(`${API_URL}/donor`, repostDonation);

      setMessage(`Delivery released back to community pool so another courier can transport it.`);
      setTimeout(() => setMessage(''), 4000);
      fetchVolunteerJobs();
    } catch (err) {
      setError('Failed to release delivery. Please try again.');
    }
  };

  const handleStartEdit = (job) => {
    setEditingJob(job);
    setEditForm({
      volunteerName: job.volunteerName || '',
      NIC: job.NIC || '',
      vehicleNo: job.vehicleNo || '',
      volunteerTelephoneNo: job.volunteerTelephoneNo || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateDelivery = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      await axios.patch(`${API_URL}/volunteer/delivery-jobs/${editingJob._id}`, {
        volunteerName: editForm.volunteerName,
        NIC: editForm.NIC,
        vehicleNo: editForm.vehicleNo,
        volunteerTelephoneNo: Number(editForm.volunteerTelephoneNo)
      });

      setMessage('Delivery courier details updated successfully!');
      setTimeout(() => setMessage(''), 4000);
      setEditingJob(null);
      fetchVolunteerJobs();
    } catch (err) {
      setError('Failed to update details. Please check inputs.');
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">My Delivery Missions</h2>
          <p className="page-subtitle">Track your active transports, view pickup/dropoff coordinates, or update transport vehicle.</p>
        </div>
        <Link to="/volunteer-delivery-accept" className="btn btn-primary">
          + Accept New Delivery
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

      {/* Edit Modal / Drawer if active */}
      {editingJob && (
        <div
          style={{
            background: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            border: '2px solid #059669',
            marginBottom: '32px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Edit Courier Transport Info for "{editingJob.requestTitle}"
            </h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEditingJob(null)}
            >
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleUpdateDelivery}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit_volName">Courier Name</label>
                <input
                  type="text"
                  id="edit_volName"
                  value={editForm.volunteerName}
                  onChange={(e) => setEditForm({ ...editForm, volunteerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_NIC">NIC / ID No.</label>
                <input
                  type="text"
                  id="edit_NIC"
                  value={editForm.NIC}
                  onChange={(e) => setEditForm({ ...editForm, NIC: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit_vehicle">Vehicle / License No.</label>
                <input
                  type="text"
                  id="edit_vehicle"
                  value={editForm.vehicleNo}
                  onChange={(e) => setEditForm({ ...editForm, vehicleNo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_phone">Contact Phone</label>
                <input
                  type="tel"
                  id="edit_phone"
                  value={editForm.volunteerTelephoneNo}
                  onChange={(e) => setEditForm({ ...editForm, volunteerTelephoneNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Save Courier Details
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingJob(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deliveries List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Loading your active missions...
        </div>
      ) : volunteerJobs.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <h3>No Active Delivery Missions</h3>
          <p>You haven't accepted any delivery jobs yet. View available requests and help deliver food today.</p>
          <Link to="/volunteer-delivery-accept" className="btn btn-primary">
            Browse Available Deliveries
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {volunteerJobs.map((job) => (
            <div className="item-card" key={job._id}>
              <div>
                <div className="card-top-row">
                  <h4>{job.requestTitle}</h4>
                  <span className="role-badge volunteer">In Transit</span>
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#d97706', textTransform: 'uppercase' }}>
                      📍 1. Pickup Origin (Donor)
                    </div>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{job.donorName}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{job.donorLocation}</div>
                    <div style={{ color: '#059669', fontSize: '0.85rem' }}>Phone: {job.donorTelephone}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669', textTransform: 'uppercase' }}>
                      🎯 2. Dropoff Destination (Organization)
                    </div>
                    <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.92rem' }}>{job.orgName}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{job.orgLocation}</div>
                    <div style={{ color: '#059669', fontSize: '0.85rem' }}>Phone: {job.orgTelephone}</div>
                  </div>

                  <div className="card-detail-item">
                    <strong>Cargo Size:</strong>
                    <span>{job.donationSize}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Courier Name:</strong>
                    <span>{job.volunteerName}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Vehicle:</strong>
                    <span>{job.vehicleNo}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStartEdit(job)}
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeclineDelivery(job)}
                >
                  Release Delivery
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VolunteerMgmt;
