import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-group ${error ? 'input-group-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-input"
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;
