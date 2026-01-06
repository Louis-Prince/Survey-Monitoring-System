import { useState, useContext, useEffect  } from "react";
import { User, Users, Shield, ArrowLeft } from 'lucide-react';
import './createUser.css';
import { UserContext } from "../../../Context/User/UserContext";
import FormInput from "../../../Components/FormInput/FormInput";
import Button from "../../../Components/Button/button";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../Components/Modal/modal";
import Loader from "../../../Components/Loader/loader";

const CreateUser = () => {
  const [formData, setFormData] = useState(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    surveys: [],
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const isRoleSelected = Boolean(formData.role);
  const isAutoAssignRole = formData.role === 'Admin' || formData.role === 'Supervisor';

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { createUser, updateUser, getUserById } = useContext(UserContext);

  useEffect(() => {
    if (!isEditMode) return;
  
    const loadUser = async () => {
      try {
        const user = await getUserById(id);
  
        setFormData({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          status: user.status,
          surveys: user.surveys || [],
        });
      } catch {
        openModal({
        type: 'error',
        title: 'Failed to Load User',
        message: 'Failed to load user data. Please try again later.',
      });
      }
    };
  
    loadUser();
  }, [id, isEditMode, getUserById]);

  const openModal = ({ type, title, message }) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };
  
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalClose = () => {
    closeModal();
  
    if (shouldNavigate) {
      navigate('/dashboard/system-admin');
    }
  };

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: 'Admin', label: 'Administrator' },
    { value: 'Supervisor', label: 'Survey Supervisor' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'Team Leader', label: 'Team Leader' }
  ];

  const surveyOptions = [
    { value: 'EICV6', label: 'EICV6 - Integrated Household Living Conditions Survey' },
    { value: 'CENSUS2022', label: 'Population and Housing Census 2022' },
    { value: 'CPI', label: 'Consumer Price Index Survey' },
    { value: 'LFS', label: 'Labour Force Survey' },
    { value: 'SAS', label: 'Seasonal Agricultural Survey' },
    { value: 'Establishment', label: 'Establishment Census' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prev => {
      let updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (name === 'role') {
        const isAuto =
          value === 'Admin' || value === 'Supervisor';
      
        if (isAuto) {
          updated.surveys = surveyOptions;
        } else {
          updated.surveys = [];
        }
      }
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

    if (!isAutoAssignRole && formData.surveys.length === 0) {
      newErrors.surveys = 'At least one survey must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; 
    setIsSubmitting(true);
  
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phone,
      role: formData.role,
      is_active: formData.status,
      survey_types: formData.surveys.map(s => s.value),
    };
  
    try {
      if (isEditMode) {
        const response = await updateUser(id, payload);
        setShouldNavigate(true);
        openModal({
          type: 'success',
          title: 'User Updated',
          message: response.message,
        });
      } else {
        const response = await createUser(payload);
        setShouldNavigate(true);
        openModal({
          type: 'success',
          title: 'User Created',
          message: response.message,
        });
      }
    } catch (err) {
      setShouldNavigate(false);
      openModal({
        type: 'error',
        title: 'Operation Failed',
        message: err.message || 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <button className="back-btn" onClick={() => navigate("/dashboard/system-admin")}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="header-card">
          <div className="header-content">
            <div className="header-icon">
              <Users className="icon-lg" />
            </div>
            <h1 className="page-title"> {isEditMode  ? "Edit User" : "Add New User"} </h1>
          </div>
          <p className="page-description">
             {isEditMode  ? "Edit an existing user in the NISR Survey Monitoring System" : "Add a new user to the NISR Survey Monitoring System"}
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
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={roleOptions}
              required={true}
              error={errors.role}
              helperText="Defines user permissions"
            />
          </div>

          {isRoleSelected && !isAutoAssignRole && (
            <div className="form-section">
              <h2 className="section-title-required">
                Survey Assignment
                <span className="required-asterisk">*</span>
              </h2>
              
              <FormInput
                type="select"
                label="Survey"
                name="survey"
                value={formData.surveys[0]?.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
              
                  const selectedSurvey = surveyOptions.find( (s) => s.value === value);
              
                  if (selectedSurvey) {
                    setFormData((prev) => ({
                      ...prev,
                      surveys: [selectedSurvey],
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      surveys: [],
                    }));
                  }
                }}
                options={[
                  { value: "", label: "Select a survey" },
                  ...surveyOptions,
                ]}
                required={true}
                error={errors.surveys}
              />

              {errors.surveys && (
                <p className="error-text survey-error"> {errors.surveys} </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              text={isEditMode? ' Update User' : 'Add User'}
            />           
          </div>
        </div>

        <Modal
          isOpen={modal.isOpen}
          icon={modal.type}
          title={modal.title}
          message={modal.message}
          buttons={[
            {
              label: 'OK',
              style: 'btn-primary',
              action: handleModalClose
            },
          ]}
          onClose={handleModalClose}
        />
      </div>

      {isSubmitting && <Loader />}
    </div>
  );
}
export default CreateUser;
