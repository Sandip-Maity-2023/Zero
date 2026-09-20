import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

// Layout & Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HelpChat from './Components/HelpChat';

// Landing & Auth Pages
import LandingPage from './Pages/Landing Pages/LandingPage';
import Login from './Pages/Landing Pages/LoginPage';
import Signup from './Pages/Landing Pages/SignUpPage';

// Volunteer Pages
import VolunteerHome from './Pages/Volunteer/VolunteerHomePage';
import VolunteerDeliveryAccept from './Pages/Volunteer/VolunteerDeliveryAccept';
import VolunteerMgmt from './Pages/Volunteer/VolunteerMgmt';

// Organization Pages
import OrganizationHome from './Pages/Organization/OrganizationHomePage';
import FoodAidRequest from './Pages/Organization/FoodAidRequestPage';
import OrganizationMgmt from './Pages/Organization/OrganizationMgmtPage';

// Donor Pages
import DonorHome from './Pages/Donor/DonorHomePage';
import DonorAcceptRequest from './Pages/Donor/DonorAcceptRequestPage';
import DonorMgmt from './Pages/Donor/DonorMgmtPage';

// Admin Pages
import AdminHome from './Pages/admin/AdminHomePage';
import AdminAccept from './Pages/admin/AdminAccept';
import AdminManage from './Pages/admin/AdminManage';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Organization Protected Routes */}
              <Route
                path="/organization-home"
                element={
                  <ProtectedRoute allowedRoles={['organization']}>
                    <OrganizationHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/foodaidrequest"
                element={
                  <ProtectedRoute allowedRoles={['organization']}>
                    <FoodAidRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organization-mgmt"
                element={
                  <ProtectedRoute allowedRoles={['organization']}>
                    <OrganizationMgmt />
                  </ProtectedRoute>
                }
              />

              {/* Volunteer Protected Routes */}
              <Route
                path="/volunteer-home"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer-delivery-accept"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerDeliveryAccept />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer-mgmt"
                element={
                  <ProtectedRoute allowedRoles={['volunteer']}>
                    <VolunteerMgmt />
                  </ProtectedRoute>
                }
              />

              {/* Donor Protected Routes */}
              <Route
                path="/donor-home"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor-accept-request"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorAcceptRequest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor-mgmt"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorMgmt />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin-home"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-accept"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAccept />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-mgmt"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminManage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <HelpChat />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
