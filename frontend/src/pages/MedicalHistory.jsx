import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const MedicalHistory = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  
  // Delete modal state
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      if (response.data && response.data.reports) {
        setReports(response.data.reports);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to retrieve your medical history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    setDeleting(true);
    setError('');
    
    try {
      await api.delete(`/reports/${reportToDelete.id}`);
      // Remove from local state
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportToDelete.id));
      setReportToDelete(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete the report. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setReportToDelete(null);
  };

  // Helper: Format Dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper: Format Bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Extract unique report types for filter dropdown
  const reportTypes = ['All', ...new Set(reports.map((r) => r.reportType || 'General Report'))];

  // Filtering Logic
  const filteredReports = reports.filter((report) => {
    const typeLabel = report.reportType || 'General Report';
    
    // Check report type match
    const matchesType = selectedType === 'All' || typeLabel.toLowerCase() === selectedType.toLowerCase();
    
    // Check search query match (original filename, report type, or extracted text contents)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      report.originalFilename.toLowerCase().includes(query) ||
      typeLabel.toLowerCase().includes(query) ||
      false;

    return matchesType && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner message="Retrieving medical history archive..." />;
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>Medical History</h1>
          <p>Access, search, and manage your uploaded health records.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          ➕ Upload New
        </Link>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by report name, type, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              &times;
            </button>
          )}
        </div>

        <div className="filter-select-container">
          <label htmlFor="type-filter">Category:</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            {reportTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Display list */}
      {filteredReports.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Report Details</th>
                <th>Classification</th>
                <th>File Details</th>
                <th>Date Uploaded</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="report-name-td">
                      <span className="file-icon-mini">📄</span>
                      <Link to={`/reports/${report.id}`} className="report-name-link" title={report.originalFilename}>
                        {report.originalFilename}
                      </Link>
                    </div>
                  </td>
                  <td>
                    <span className="badge-category">
                      {report.reportType || 'General Report'}
                    </span>
                  </td>
                  <td>
                    <span className="file-size-td">
                      {report.fileType?.toUpperCase()} ({formatBytes(report.fileSize)})
                    </span>
                  </td>
                  <td>
                    <span className="file-date-td">
                      {formatDate(report.uploadedAt)}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/reports/${report.id}`)}
                        className="btn-action-view"
                      >
                        View
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(report)}
                        className="btn-action-delete"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-reports-card">
          <span className="empty-state-icon">📋</span>
          <h3>No reports matching filters</h3>
          <p>
            {reports.length === 0
              ? "You haven't uploaded any medical documents yet."
              : "Try adjusting your search criteria or filter category."}
          </p>
          {reports.length === 0 ? (
            <Link to="/upload" className="btn btn-primary mt-4">
              Upload Report
            </Link>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {reportToDelete && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to permanently delete the report{' '}
              <strong>"{reportToDelete.originalFilename}"</strong>?
            </p>
            <p className="modal-warning-text">
              ⚠️ This will delete the database metadata and remove the PDF document from our servers permanently. This action cannot be undone.
            </p>
            <div className="modal-action-row">
              <Button
                variant="danger"
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete File
              </Button>
              <Button variant="secondary" onClick={handleCancelDelete} disabled={deleting}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
