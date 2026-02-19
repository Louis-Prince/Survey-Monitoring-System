import { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import './formInput.css';

const FormInput = ({ 
  type = 'text',
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  disabled = false,
  helperText,
  rows = 4,
  otherStyles = {},
  leftIcon,    
  rightIcon 
}) => {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = () => {
    switch (type) {
      case 'select':
      return (
        <div className=" select-wrapper">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`form-input form-select ${error ? 'form-input-error' : ''} ${disabled ? 'form-input-disabled' : ''}`}
            disabled={disabled}
            required={required}
            style={otherStyles}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="select-icon" />
        </div>
      );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input form-textarea ${error ? 'form-input-error' : ''} ${disabled ? 'form-input-disabled' : ''}`}
            disabled={disabled}
            required={required}
            rows={rows}
            style={otherStyles}
          />
        );

      case 'checkbox':
        return (
          <div className="checkbox-container">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              className="form-checkbox"
              disabled={disabled}
              style={otherStyles}
            />
            <label className="checkbox-label">{label}</label>
          </div>
        );

      case 'radio':
        return (
          <div className="radio-group">
            {options.map((option, index) => (
              <div key={index} className="radio-container">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="form-radio"
                  disabled={disabled}
                  style={otherStyles}
                />
                <label className="radio-label">{option.label}</label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="input-wrapper">
            {leftIcon && (
              <span className="input-icon left-icon">
                {leftIcon}
              </span>
            )}
            <input
              type={isPassword && showPassword ? 'text' : type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`form-input ${error ? 'form-input-error' : ''} ${disabled ? 'form-input-disabled' : ''} ${leftIcon ? 'has-left-icon' : ''} ${rightIcon || isPassword ? 'has-right-icon' : ''}`}
              disabled={disabled}
              required={required}
              style={otherStyles}
            />

            {isPassword ? (
              <span
                className="input-icon right-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            ) : (
              rightIcon && (
                <span className="input-icon right-icon">
                  {rightIcon}
                </span>
              )
            )}
          </div>
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="form-group">
        {renderInput()}
        {error && <p className="error-text">{error}</p>}
        {helperText && <p className="helper-text">{helperText}</p>}
      </div>
    );
  }

  return (
    <div className="form-group">
      {label && type !== "select" && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      {renderInput()}

      {error && <p className="error-text">{error}</p>}
      {helperText && <p className="helper-text">{helperText}</p>}
    </div>
  );
};

export default FormInput;
