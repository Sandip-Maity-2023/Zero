import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function AdminAccept() {
  const [adminJobs, setAdminJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newOrg, setNewOrg] = useState({
    organizationName: '',
    regNo: '',
    address: '',
    telephoneNo: '',
    email: '',
    password: '',
    confirmPw: ''
  });

  const fetchAdminJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/approves`);
      setAdminJobs(response.data || []);
    } catch (err) {
      console.error('Error fetching admin approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const handleChange = (e) => {
    setNewOrg({ ...newOrg, [e.target.name]: e.target.value });
  };

  const handleCreateApprove = async (e) => {
    e.preventDefault();
    if (newOrg.password !== newOrg.confirmPw) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${API_URL}/admin/approves`, {
        ...newOrg,
        telephoneNo: Number(newOrg.telephoneNo)
      });
      setMessage(`Organization "${newOrg.organizationName}" approved and registered!`);
      setTimeout(() => setMessage(''), 4000);
      setNewOrg({
        organizationName: '',
        regNo: '',
        address: '',
        telephoneNo: '',
        email: '',
        password: '',
        confirmPw: ''
      });
      fetchAdminJobs();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve organization.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete approval record for ${name}?`)) return;

    try {
      await axios.delete(`${API_URL}/admin/approves/${id}`);
      setMessage(`Record removed.`);
      setTimeout(() => setMessage(''), 3000);
      fetchAdminJobs();
    } catch (err) {
      setError('Failed to delete record.');
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Organization Approvals Queue</h2>
          <p className="page-subtitle">Verify legitimacy of applying organizations and issue verified partner credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin-home" className="btn btn-secondary">
            ← Dashboard
          </Link>
          <Link to="/admin-mgmt" className="btn btn-primary">
            Admin Management →
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
        {/* Approved / Pending List */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>
            Verified Organization Directory ({adminJobs.length})
          </h3>

          {loading ? (
            <p style={{ color: '#64748b' }}>Loading directory...</p>
          ) : adminJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No Organizations in Directory</h3>
              <p>Approve or register an organization using the verification form.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {adminJobs.map((item) => (
                <div className="item-card" key={item._id}>
                  <div className="card-top-row">
                    <h4>{item.organizationName}</h4>
                    <span className="role-badge admin">Approved</span>
                  </div>

                  <div style={{ margin: '10px 0' }}>
                    <div className="card-detail-item">
                      <strong>Registration No:</strong>
                      <span>{item.regNo}</span>
                    </div>
                    <div className="card-detail-item">
                      <strong>Email:</strong>
                      <span>{item.email}</span>
                    </div>
                    <div className="card-detail-item">
                      <strong>Telephone:</strong>
                      <span>{item.telephoneNo}</span>
                    </div>
                    <div className="card-detail-item">
                      <strong>Address:</strong>
                      <span>{item.address}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id, item.organizationName)}
                    >
                      Remove Verification
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification / Manual Approval Form */}
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
            🛡️ Verify & Register Org
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
            Enter organization legal details to add to the verified roster.
          </p>

          <form onSubmit={handleCreateApprove}>
            <div className="form-group">
              <label htmlFor="organizationName">Organization Name</label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={newOrg.organizationName}
                onChange={handleChange}
                placeholder="e.g. City Food Bank"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="regNo">Official Reg / Tax ID</label>
              <input
                type="text"
                id="regNo"
                name="regNo"
                value={newOrg.regNo}
                onChange={handleChange}
                placeholder="e.g. NGO-4491"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Official Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newOrg.email}
                onChange={handleChange}
                placeholder="info@foodbank.org"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephoneNo">Contact Phone</label>
              <input
                type="tel"
                id="telephoneNo"
                name="telephoneNo"
                value={newOrg.telephoneNo}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Official Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={newOrg.address}
                onChange={handleChange}
                placeholder="e.g. 100 Main Road, Suite 2"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Assigned Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newOrg.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPw">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPw"
                  name="confirmPw"
                  value={newOrg.confirmPw}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
              Confirm Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAccept;