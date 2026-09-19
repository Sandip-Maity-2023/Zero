import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

const initialDonation = {
  orgId: '',
  orgName: '',
  requestTitle: '',
  population: '',
  dueDate: '',
  orgOtherDetails: '',
  orgLocation: '',
  orgTelephone: '',
  donorId: 'sampleDonorID',
  donorName: '',
  donationSize: '',
  deliveryMethod: 'volunteer-delivery',
  donorTelephone: '',
  donorOtherDetails: '',
  donorLocation: ''
};

function DonorAcceptRequestPage() {
  const [requests, setRequests] = useState([]);
  const [donation, setDonation] = useState(initialDonation);

  const fetchRequests = async () => {
    const response = await axios.get(`${API_URL}/org`);
    setRequests(response.data);
  };

  const selectRequest = (request) => {
    setDonation({
      ...initialDonation,
      orgId: request._id,
      orgName: request.orgName,
      requestTitle: request.requestTitle,
      population: request.population,
      dueDate: request.dueDate,
      orgOtherDetails: request.orgOtherDetails,
      orgLocation: request.orgLocation,
      orgTelephone: request.orgTelephone
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value });
  };

  const createDonation = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/donor`, donation);
    alert('Donation offer created');
    setDonation(initialDonation);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 id="page-title">Donor Request Acceptance</h2>
      <div className="home">
        <div className="workouts">
          <h3>Open Food Aid Requests</h3>
          {requests.map((request) => (
            <div className="workout-details" key={request._id}>
              <h4>{request.requestTitle}</h4>
              <p><strong>Organization Name : </strong>{request.orgName}</p>
              <p><strong>Population : </strong>{request.population}</p>
              <p><strong>Due Date : </strong>{request.dueDate}</p>
              <p><strong>Location : </strong>{request.orgLocation}</p>
              <span>
                <button onClick={() => selectRequest(request)}>Donate</button>
              </span>
            </div>
          ))}
        </div>

        <form className="create" onSubmit={createDonation}>
          <h3>Provide Donation</h3>
          <h4>Request Title : {donation.requestTitle}</h4>

          <label>Donor Name:</label>
          <input type="text" name="donorName" value={donation.donorName} onChange={handleChange} required />

          <label>Donation Size:</label>
          <input type="text" name="donationSize" value={donation.donationSize} onChange={handleChange} required />

          <label>Delivery Method:</label>
          <select id="role" name="deliveryMethod" value={donation.deliveryMethod} onChange={handleChange} required>
            <option value="volunteer-delivery">Volunteer Delivery</option>
            <option value="self-delivery">Self Delivery</option>
          </select>

          <label>Telephone No:</label>
          <input type="number" name="donorTelephone" value={donation.donorTelephone} onChange={handleChange} required />

          <label>Location:</label>
          <input type="text" name="donorLocation" value={donation.donorLocation} onChange={handleChange} required />

          <label>Other Details:</label>
          <input type="text" name="donorOtherDetails" value={donation.donorOtherDetails} onChange={handleChange} required />

          <button>Create Donation</button>
        </form>
      </div>
    </div>
  );
}

export default DonorAcceptRequestPage;
