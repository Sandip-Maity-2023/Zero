import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState('organization'); // 'organization' | 'volunteer' | 'donor'
  
  // Organization form state
  const [orgForm, setOrgForm] = useState({
    orgName: '',
    registrationNo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Volunteer & Donor form state
  const [individualForm, setIndividualForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleOrgChange = (e) => {
    setOrgForm({ ...orgForm, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleIndividualChange = (e) => {
    setIndividualForm({ ...individualForm, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleOrgSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (orgForm.password !== orgForm.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (orgForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        role: 'organization',
        orgName: orgForm.orgName,
        registrationNo: orgForm.registrationNo,
        email: orgForm.email,
        password: orgForm.password
      };

      const result = await signup(payload);
      // Automatic navigation upon registration
      navigate(result.redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleIndividualSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (individualForm.password !== individualForm.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (individualForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        role: selectedRole, // 'volunteer' or 'donor'
        firstName: individualForm.firstName,
        lastName: individualForm.lastName,
        email: individualForm.email,
        password: individualForm.password
      };

      const result = await signup(payload);
      // Automatic navigation upon registration
      navigate(result.redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌱</div>
        <h2>Join ZeroHunger</h2>
        <p>Choose your role and help eliminate hunger in our communities</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="role-switch-tabs">
        <button
          type="button"
          className={`role-tab-btn ${selectedRole === 'organization' ? 'active' : ''}`}
          onClick={() => { setSelectedRole('organization'); setErrorMessage(''); }}
        >
          🏛️ Organization
        </button>
        <button
          type="button"
          className={`role-tab-btn ${selectedRole === 'volunteer' ? 'active' : ''}`}
          onClick={() => { setSelectedRole('volunteer'); setErrorMessage(''); }}
        >
          🚴 Volunteer
        </button>
        <button
          type="button"
          className={`role-tab-btn ${selectedRole === 'donor' ? 'active' : ''}`}
          onClick={() => { setSelectedRole('donor'); setErrorMessage(''); }}
        >
          🎁 Donor
        </button>
      </div>

      {errorMessage && (
        <div className="alert-error">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {selectedRole === 'organization' ? (
        <form onSubmit={handleOrgSubmit}>
          <div className="form-group">
            <label htmlFor="orgName">Organization / NGO Name</label>
            <input
              type="text"
              id="orgName"
              name="orgName"
              placeholder="e.g. Hope Community Kitchen"
              value={orgForm.orgName}
              onChange={handleOrgChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationNo">Registration / Charity Number</label>
            <input
              type="text"
              id="registrationNo"
              name="registrationNo"
              placeholder="e.g. REG-883921"
              value={orgForm.registrationNo}
              onChange={handleOrgChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Official Organization Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="contact@org.ngo"
              value={orgForm.email}
              onChange={handleOrgChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Min. 6 chars"
                value={orgForm.password}
                onChange={handleOrgChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat password"
                value={orgForm.confirmPassword}
                onChange={handleOrgChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering Organization...' : 'Sign Up as Organization'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleIndividualSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First name"
                value={individualForm.firstName}
                onChange={handleIndividualChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last name"
                value={individualForm.lastName}
                onChange={handleIndividualChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@domain.com"
              value={individualForm.email}
              onChange={handleIndividualChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Min. 6 chars"
                value={individualForm.password}
                onChange={handleIndividualChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat password"
                value={individualForm.confirmPassword}
                onChange={handleIndividualChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading
              ? 'Creating Account...'
              : `Sign Up as ${selectedRole === 'volunteer' ? 'Volunteer' : 'Donor'}`}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
