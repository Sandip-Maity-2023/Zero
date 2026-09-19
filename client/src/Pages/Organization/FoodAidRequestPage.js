import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../api';
import { useAuth } from '../../context/AuthContext';

function FoodAidRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState({
    orgName: user?.orgName || '',
    requestTitle: '',
    population: '',
    dueDate: '',
    orgLocation: '',
    orgTelephone: '',
    orgOtherDetails: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const payload = {
        orgId: user?._id || 'sampleOrgID',
        orgName: request.orgName || user?.orgName || 'Organization',
        requestTitle: request.requestTitle,
        population: request.population.toString(),
        dueDate: request.dueDate,
        orgLocation: request.orgLocation,
        orgTelephone: Number(request.orgTelephone),
        orgOtherDetails: request.orgOtherDetails || 'None'
      };

      await axios.post(`${API_URL}/org`, payload);
      setSuccess(true);
      setRequest({
        orgName: user?.orgName || '',
        requestTitle: '',
        population: '',
        dueDate: '',
        orgLocation: '',
        orgTelephone: '',
        orgOtherDetails: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create food aid request. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="page-header">
        <Link to="/organization-home" style={{ color: '#059669', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Dashboard
        </Link>
        <h2 id="page-title" style={{ marginTop: '8px' }}>Create Food Aid Request</h2>
        <p className="page-subtitle">Publish an aid requirement so food donors and couriers can fulfill it.</p>
      </div>

      {error && (
        <div className="alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="alert-success">
          <span>✅</span> Food aid request created and published successfully!
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={() => navigate('/organization-mgmt')}
          >
            View in Management →
          </button>
        </div>
      )}

      <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="orgName">Organization / Shelter Name</label>
            <input
              type="text"
              id="orgName"
              name="orgName"
              value={request.orgName}
              onChange={handleChange}
              placeholder="e.g. St. Jude Community Kitchen"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="requestTitle">Request Title / Need Summary</label>
            <input
              type="text"
              id="requestTitle"
              name="requestTitle"
              value={request.requestTitle}
              onChange={handleChange}
              placeholder="e.g. 150 Hot Lunch Meals for Senior Residents"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="population">Target Population (Headcount)</label>
              <input
                type="number"
                id="population"
                name="population"
                min="1"
                value={request.population}
                onChange={handleChange}
                placeholder="e.g. 150"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Required By Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={request.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="orgLocation">Delivery Address / Destination</label>
              <input
                type="text"
                id="orgLocation"
                name="orgLocation"
                value={request.orgLocation}
                onChange={handleChange}
                placeholder="e.g. 45 Green Avenue, Sector 4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="orgTelephone">Contact Telephone</label>
              <input
                type="tel"
                id="orgTelephone"
                name="orgTelephone"
                value={request.orgTelephone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="orgOtherDetails">Special Requirements / Dietary Notes</label>
            <textarea
              id="orgOtherDetails"
              name="orgOtherDetails"
              rows="3"
              value={request.orgOtherDetails}
              onChange={handleChange}
              placeholder="e.g. Vegetarian preference, individual pack containers needed, arrive before 12:30 PM."
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Submitting Request...' : 'Publish Food Aid Request'}
            </button>
            <Link to="/organization-mgmt" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FoodAidRequestPage;
