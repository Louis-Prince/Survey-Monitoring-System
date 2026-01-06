import { useState } from "react";
import FormInput from "../../Components/formInput";
import { Plus, X, User, Users, Shield } from 'lucide-react';
import '../../CSS/createUser.css';
import Button from "../../Components/button";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    surveys: [],
  });

  const [currentSurvey, setCurrentSurvey] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRoleSelected = Boolean(formData.role);
  const isMultiSurveyRole = formData.role === 'admin' || formData.role === 'supervisor';

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'supervisor', label: 'Survey Supervisor' },
    { value: 'data_analyst', label: 'Data Analyst' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const surveyOptions = [
    { value: 'eicv6', label: 'EICV6 - Integrated Household Living Conditions Survey' },
    { value: 'census2022', label: 'Population and Housing Census 2022' },
    { value: 'cpi', label: 'Consumer Price Index Survey' },
    { value: 'labor_force', label: 'Labour Force Survey' },
    { value: 'agriculture', label: 'National Agricultural Survey' },
    { value: 'establishment', label: 'Establishment Census' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prev => {
      let updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (name === 'role') {
        const isMulti = value === 'admin' || value === 'supervisor';
        if (!isMulti && updated.surveys.length > 1) {
          updated.surveys = updated.surveys.slice(0, 1);
        }
      }
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSurvey = () => {
    if (!currentSurvey) return;
  
    if (!isMultiSurveyRole && formData.surveys.length >= 1) {
      return;
    }
  
    if (!formData.surveys.find(s => s.value === currentSurvey)) {
      const selectedSurvey = surveyOptions.find(
        s => s.value === currentSurvey
      );
  
      if (selectedSurvey) {
        setFormData(prev => ({
          ...prev,
          surveys: [...prev.surveys, selectedSurvey]
        }));
        setCurrentSurvey('');
      }
    }
  };

  const handleRemoveSurvey = (surveyValue) => {
    setFormData(prev => ({
      ...prev,
      surveys: prev.surveys.filter(s => s.value !== surveyValue)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (formData.surveys.length === 0) {
      newErrors.surveys = 'At least one survey must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('User created successfully!');
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        status: 'active',
        surveys: [],
      });
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <div className="header-icon">
              <Users className="icon-lg" />
            </div>
            <h1 className="page-title">Add New User</h1>
          </div>
          <p className="page-description">
            Add a new user to the NISR Survey Monitoring System
          </p>
        </div>

        <div className="form-card">
          <div className="form-section">
            <h2 className="section-title">
              <User className="section-icon" />
              Personal Information
            </h2>
            
            <div className="form-grid">
              <FormInput
                type="text"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required={true}
                error={errors.firstName}
              />

              <FormInput
                type="text"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required={true}
                error={errors.lastName}
              />
            </div>

            <FormInput
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="user@nisr.gov.rw"
              required={true}
              error={errors.email}
              helperText="User will receive login credentials at this email"
            />

            <FormInput
              type="tel"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+250 XXX XXX XXX"
              helperText="Optional contact number"
            />
          </div>

          <div className="form-section">
            <h2 className="section-title">
              <Shield className="section-icon" />
              Role
            </h2>

            <FormInput
              type="select"
              label="User Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              required={true}
              error={errors.role}
              helperText="Defines user permissions"
            />
          </div>

          {isRoleSelected && (
            <div className="form-section">
              <h2 className="section-title-required">
                Survey Assignment
                <span className="required-asterisk">*</span>
              </h2>
          
              <div className="survey-input-group">
                <div className="survey-select-wrapper">
                  <select value={currentSurvey}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentSurvey(value);
                    
                      if (!isMultiSurveyRole && value) {
                        const selectedSurvey = surveyOptions.find(s => s.value === value);
                    
                        if (selectedSurvey) {
                          setFormData(prev => ({ ...prev, surveys: [selectedSurvey]}));
                        }
                      }
                    }}
          
                    className="form-input"
                    disabled={!isMultiSurveyRole && formData.surveys.length >= 1}
                  >
                    <option value="">
                      {isMultiSurveyRole ? 'Select a survey to add' : 'Select a survey'}
                    </option>
          
                    {surveyOptions
                      .filter(option => !formData.surveys.find(s => s.value === option.value))
                      .map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
          
                {isMultiSurveyRole && (
                  <button type="button" onClick={handleAddSurvey} disabled={!currentSurvey} className="btn-add-survey">
                    <Plus className="btn-icon" /> Add Survey
                  </button>
                )}
              </div>
          
              {!isMultiSurveyRole && (
                <p className="helper-text">
                  This role can be assigned to only one survey
                </p>
              )}
          
              {errors.surveys && (
                <p className="error-text survey-error">
                  {errors.surveys}
                </p>
              )}
          
              {formData.surveys.length > 0 ? (
                <div className="surveys-list">
                  <p className="surveys-list-title">
                    Assigned Surveys:
                  </p>
          
                  <div className="surveys-items">
                    {formData.surveys.map((survey) => (
                      <div key={survey.value} className="survey-item">
                        <span className="survey-item-text">
                          {survey.label}
                        </span>
          
                        <button
                          type="button"
                          onClick={() => handleRemoveSurvey(survey.value)}
                          className="btn-remove-survey"
                        >
                          <X className="icon-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-surveys">
                  <p className="empty-surveys-text">
                    No surveys assigned yet
                  </p>
                  <p className="empty-surveys-subtext">
                    {isMultiSurveyRole ? 'Add surveys using the button above' : 'Select one survey from the list above'}
                  </p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              text={isSubmitting ? 'Adding User...' : 'Add User'}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateUser;
