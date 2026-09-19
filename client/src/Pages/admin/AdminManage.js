import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';

function AdminManage() {
  const [adminJobs, setAdminJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    organizationName: '',
    regNo: '',
    address: '',
    telephoneNo: '',
    email: ''
  });

  const fetchAdminJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/approves`);
      setAdminJobs(response.data || []);
    } catch (err) {
      console.error('Error fetching admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminJobs();
  }, []);

  const handleStartEdit = (item) => {
    setEditingOrg(item);
    setEditForm({
      organizationName: item.organizationName || '',
      regNo: item.regNo || '',
      address: item.address || '',
      telephoneNo: item.telephoneNo || '',
      email: item.email || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingOrg) return;

    try {
      await axios.patch(`${API_URL}/admin/approves/${editingOrg._id}`, {
        organizationName: editForm.organizationName,
        regNo: editForm.regNo,
        address: editForm.address,
        telephoneNo: Number(editForm.telephoneNo),
        email: editForm.email
      });

      setMessage(`Organization details updated for "${editForm.organizationName}".`);
      setTimeout(() => setMessage(''), 4000);
      setEditingOrg(null);
      fetchAdminJobs();
    } catch (err) {
      setError('Failed to update organization details.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`${API_URL}/admin/approves/${id}`);
      setMessage(`Deleted ${name}.`);
      setTimeout(() => setMessage(''), 3000);
      fetchAdminJobs();
    } catch (err) {
      setError('Failed to delete organization.');
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h2 id="page-title">Admin Organization Management</h2>
          <p className="page-subtitle">Maintain accredited partner organizations, update contact lines, or revoke access.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin-home" className="btn btn-secondary">
            ← Dashboard
          </Link>
          <Link to="/admin-accept" className="btn btn-primary">
            + Verify New Org
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

      {editingOrg && (
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
              Edit Organization: {editingOrg.organizationName}
            </h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEditingOrg(null)}
            >
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit_orgName">Organization Name</label>
                <input
                  type="text"
                  id="edit_orgName"
                  value={editForm.organizationName}
                  onChange={(e) => setEditForm({ ...editForm, organizationName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_regNo">Registration / Charity No</label>
                <input
                  type="text"
                  id="edit_regNo"
                  value={editForm.regNo}
                  onChange={(e) => setEditForm({ ...editForm, regNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit_email">Email Address</label>
                <input
                  type="email"
                  id="edit_email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit_phone">Telephone</label>
                <input
                  type="tel"
                  id="edit_phone"
                  value={editForm.telephoneNo}
                  onChange={(e) => setEditForm({ ...editForm, telephoneNo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit_address">Address</label>
              <input
                type="text"
                id="edit_address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingOrg(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Loading organization records...
        </div>
      ) : adminJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No Organization Records Found</h3>
          <p>Register or verify an organization to start managing records.</p>
          <Link to="/admin-accept" className="btn btn-primary">
            Verify Organization
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {adminJobs.map((item) => (
            <div className="item-card" key={item._id}>
              <div>
                <div className="card-top-row">
                  <h4>{item.organizationName}</h4>
                  <span className="role-badge admin">Active</span>
                </div>

                <div style={{ margin: '12px 0' }}>
                  <div className="card-detail-item">
                    <strong>Reg No:</strong>
                    <span>{item.regNo}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Email:</strong>
                    <span>{item.email}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Phone:</strong>
                    <span>{item.telephoneNo}</span>
                  </div>
                  <div className="card-detail-item">
                    <strong>Address:</strong>
                    <span>{item.address}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStartEdit(item)}
                >
                  Edit Roster Info
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id, item.organizationName)}
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminManage;