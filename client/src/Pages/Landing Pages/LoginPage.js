import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const result = await login(email, password);
      // Automatic role-based navigation immediately upon login
      navigate(result.redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔐</div>
        <h2>Welcome Back</h2>
        <p>Sign in to your ZeroHunger platform account</p>
      </div>

      {errorMessage && (
        <div className="alert-error">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@organization.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
        Don't have an account yet?{' '}
        <Link to="/signup" style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>
          Create an account
        </Link>
      </div>

      <div className="demo-accounts">
        <p>Quick Fill Demo Accounts</p>
        <div className="demo-chips">
          <button
            type="button"
            className="demo-chip-btn"
            onClick={() => fillDemoAccount('testcheck@example.com', '123456')}
          >
            Volunteer (testcheck)
          </button>
          <button
            type="button"
            className="demo-chip-btn"
            onClick={() => fillDemoAccount('org@demo.org', 'password123')}
          >
            Organization (Hope Shelter)
          </button>
          <button
            type="button"
            className="demo-chip-btn"
            onClick={() => fillDemoAccount('donor@demo.com', 'password123')}
          >
            Donor (Sarah Jenkins)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;