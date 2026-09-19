import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const getRoleHome = (role) => {
    switch (role) {
      case 'organization':
        return '/organization-home';
      case 'volunteer':
        return '/volunteer-home';
      case 'donor':
        return '/donor-home';
      case 'admin':
        return '/admin-home';
      default:
        return '/';
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password
      });

      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      return {
        success: true,
        user: receivedUser,
        role: receivedUser.role,
        redirectPath: getRoleHome(receivedUser.role)
      };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed. Please check your credentials.';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const payload = {
        ...userData,
        email: userData.email?.trim().toLowerCase()
      };

      const response = await axios.post(`${API_URL}/auth/signup`, payload);
      const { token: receivedToken, user: receivedUser } = response.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));

      return {
        success: true,
        user: receivedUser,
        role: receivedUser.role,
        redirectPath: getRoleHome(receivedUser.role)
      };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Sign up failed. Please check form fields.';
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    login,
    signup,
    logout,
    getRoleHome
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
