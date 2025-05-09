import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './auth/Dashboard';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
              <Dashboard />
          } 
        />
      </Routes>
    </Router>
  );
}
