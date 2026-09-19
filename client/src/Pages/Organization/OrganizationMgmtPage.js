import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../api';

function OrganizationMgmtPage() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const response = await axios.get(`${API_URL}/org`);
    setRequests(response.data);
  };

  const deleteRequest = async (id) => {
    await axios.delete(`${API_URL}/org/${id}`);
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h2 id="page-title">Organization Request Management</h2>
      <div className="workouts">
        {requests.map((request) => (
          <div className="workout-details" key={request._id}>
            <h4>{request.requestTitle}</h4>
            <p><strong>Organization Name : </strong>{request.orgName}</p>
            <p><strong>Population : </strong>{request.population}</p>
            <p><strong>Due Date : </strong>{request.dueDate}</p>
            <p><strong>Location : </strong>{request.orgLocation}</p>
            <p><strong>Telephone No. : </strong>{request.orgTelephone}</p>
            <p><strong>Extra Details : </strong>{request.orgOtherDetails}</p>
            <span>
              <button onClick={() => deleteRequest(request._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrganizationMgmtPage;
