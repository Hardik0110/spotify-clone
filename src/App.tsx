import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './auth/login';
import Callback from './auth/Callback';
import Dashboard from './auth/Dashboard';
import { getAuthData, isTokenExpired } from '../src/utils/utils';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = getAuthData('spotify_access_token') && !isTokenExpired();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
