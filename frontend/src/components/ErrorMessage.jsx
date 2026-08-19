import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-message-box">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
      </div>
      {onClose && (
        <button type="button" className="error-close-btn" onClick={onClose} aria-label="Close error">
          &times;
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
