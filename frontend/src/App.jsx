import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import MedicalHistory from './pages/MedicalHistory';
import ReportDetails from './pages/ReportDetails';
import ShareReports from './pages/ShareReports';
import SharedViewer from './pages/SharedViewer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          {/* Header navigation bar */}
          <Navbar />
          
          {/* Main page canvas */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shared/:token" element={<SharedViewer />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/history" element={<MedicalHistory />} />
                <Route path="/reports/:id" element={<ReportDetails />} />
                <Route path="/sharing" element={<ShareReports />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
