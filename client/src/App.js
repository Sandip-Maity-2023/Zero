import {BrowserRouter, Routes, Route } from 'react-router-dom'

//pages and componenets
import Navbar from './Components/Navbar';
//import Home from './Pages/Home';
//import Happy from './Pages/Happy';
import LandingPage from './Pages/Landing Pages/LandingPage';
import Login from './Pages/Landing Pages/LoginPage'
import Signup from './Pages/Landing Pages/SignUpPage'
import VolunteerDeliveryAccept from './Pages/Volunteer/VolunteerDeliveryAccept';
import VolunteerMgmt from './Pages/Volunteer/VolunteerMgmt';
import VolunteerHome from './Pages/Volunteer/VolunteerHomePage'
import FoodAidRequest from './Pages/Organization/FoodAidRequestPage';
import OrganizationMgmt from './Pages/Organization/OrganizationMgmtPage';
import OrganizationHome from './Pages/Organization/OrganizationHomePage';
import DonorAcceptRequest from './Pages/Donor/DonorAcceptRequestPage';
import DonorMgmt from './Pages/Donor/DonorHomePage';
import DonorHome from './Pages/Donor/DonorHomePage';
// import FoodAidRequest from './Pages/Organization/FoodAidRequestPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <div className='pages'>
            <Routes>
                <Route
                  path="/"
                  element={<LandingPage/>}
                />
                <Route
                  path="/login"
                  element={<Login/>}
                />
                <Route
                  path="/signup"
                  element={<Signup/>}
                />
                <Route
                  path="/volunteer-delivery-accept"
                  element={<VolunteerDeliveryAccept/>}
                />
                <Route
                  path="/volunteer-mgmt"
                  element={<VolunteerMgmt/>}
                />
                <Route
                  path="/volunteer-home"
                  element={<VolunteerHome/>}
                />
                <Route
                  path="/foodaidrequest"
                  element={<FoodAidRequest/>}
                />
                <Route
                  path="/organization-mgmt"
                  element={<OrganizationMgmt/>}
                />
                <Route
                  path="/organization-home"
                  element={<OrganizationHome/>}
                />
                <Route
                  path="/donor-accept-request"
                  element={<DonorAcceptRequest/>}
                />
                <Route
                  path="/donor-mgmt"
                  element={<DonorMgmt/>}
                />
                <Route
                  path="/donor-home"
                  element={<DonorHome/>}
                />
            </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
