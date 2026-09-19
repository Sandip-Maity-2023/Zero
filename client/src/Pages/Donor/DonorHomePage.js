import React from 'react';
import { Link } from 'react-router-dom';

function DonorHomePage() {
  return (
    <div>
      <h2 id="page-title">Donor Home</h2>
      <div className="homepage home-margin">
        <Link to="/donor-accept-request">
          <button className="homepagebutton">Accept Food Aid Request</button>
        </Link>
      </div>
    </div>
  );
}

export default DonorHomePage;
