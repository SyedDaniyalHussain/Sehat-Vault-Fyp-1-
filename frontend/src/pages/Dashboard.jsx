import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/reports');
      if (response.data && response.data.reports) {
        setReports(response.data.reports);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const totalReports = reports.length;
  const recentReport = totalReports > 0 ? reports[0] : null;

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome-banner">
        <div className="welcome-text-container">
          <h1>Welcome back, {user?.name}</h1>
          <p>Manage and track your medical files securely.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/upload" className="btn btn-primary">
            ➕ Upload New Report
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="dashboard-stats-grid">
        {/* Total uploaded stats card */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3>Total Uploaded Reports</h3>
            <span className="stat-icon">📄</span>
          </div>
          <div className="stat-value">{totalReports}</div>
          <div className="stat-card-footer">
            <Link to="/history">View entire Medical History &rarr;</Link>
          </div>
        </div>

        {/* Recent report summary card */}
        <div className="stat-card recent-report-card">
          <div className="stat-card-header">
            <h3>Most Recent Report</h3>
            <span className="stat-icon">🕒</span>
          </div>
          {recentReport ? (
            <div className="recent-report-details">
              <div className="recent-report-title" title={recentReport.originalFilename}>
                {recentReport.originalFilename}
              </div>
              <div className="recent-report-meta">
                <span>Type: {recentReport.reportType || 'General Report'}</span>
                <span>Size: {formatBytes(recentReport.fileSize)}</span>
                <span>Uploaded: {formatDate(recentReport.uploadedAt)}</span>
              </div>
              <div className="recent-report-action-row">
                <Link to={`/reports/${recentReport.id}`} className="btn btn-link btn-small-padding">
                  View Full Report Details &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-recent-report">
              <p>No reports uploaded yet.</p>
              <Link to="/upload" className="btn btn-link">
                Upload your first report now
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-action-hub">
        <h2>Quick Navigation</h2>
        <div className="hub-grid">
          <Link to="/upload" className="hub-card">
            <div className="hub-icon">📤</div>
            <h3>Upload PDF</h3>
            <p>Upload a new lab report or digital prescription.</p>
          </Link>
          <Link to="/history" className="hub-card">
            <div className="hub-icon">📋</div>
            <h3>Medical History</h3>
            <p>Search, filter, view details, or delete previous reports.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
