import { useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

const initialRequest = {
  orgId: 'sampleOrgID',
  orgName: '',
  requestTitle: '',
  population: '',
  dueDate: '',
  orgOtherDetails: '',
  orgLocation: '',
  orgTelephone: ''
};

function FoodAidRequestPage() {
  const [request, setRequest] = useState(initialRequest);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest({ ...request, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${API_URL}/org`, request);
      alert('Food aid request created');
      setRequest(initialRequest);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create request');
    }
  };

  return (
    <div>
      <h2 id="page-title">Food Aid Request</h2>
      <form className="create orgform" onSubmit={handleSubmit}>
        <label>Organization Name:</label>
        <input type="text" name="orgName" value={request.orgName} onChange={handleChange} required />

        <label>Request Title:</label>
        <input type="text" name="requestTitle" value={request.requestTitle} onChange={handleChange} required />

        <label>Population:</label>
        <input type="number" name="population" value={request.population} onChange={handleChange} required />

        <label>Due Date:</label>
        <input type="date" name="dueDate" value={request.dueDate} onChange={handleChange} required />

        <label>Location:</label>
        <input type="text" name="orgLocation" value={request.orgLocation} onChange={handleChange} required />

        <label>Telephone No:</label>
        <input type="number" name="orgTelephone" value={request.orgTelephone} onChange={handleChange} required />

        <label>Other Details:</label>
        <input type="text" name="orgOtherDetails" value={request.orgOtherDetails} onChange={handleChange} required />

        <button>Create Request</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default FoodAidRequestPage;
