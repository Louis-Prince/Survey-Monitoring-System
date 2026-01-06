import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../Components/formInput';
import Button from '../../Components/button';
import '../../CSS/login.css';
import Logo from '../../assets/logo.png';
import { CircleX } from 'lucide-react';
import Modal from '../../Components/modal';
import Loader from '../../Components/loader';

const Login = () => {
  const navigate = useNavigate();

  // const [showModal, setShowModal] = useState(true);
  // const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '', general: '' });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    // Replace with real API call
    const response = {
      success: false,
      message: 'Invalid email or password'
    };

    if (!response.success) {
      setErrors({
        ...errors,
        general: response.message
      });
      return;
    }

    // On success
    localStorage.setItem(
      'user',
      JSON.stringify({ has_changed_password: false })
    );
    navigate('/dashboard');
  };

  // const handleConfirm = () => {
  //   setShowModal(false);
  // };

  return (
    <div className="auth-form-container">
      <form className="auth-form-card" onSubmit={handleLogin}>
        <img src={Logo} alt="Logo" className="auth-form-logo" />

        <h2 className="auth-form-subtitle">
          Centralized Survey Monitoring System
        </h2>

        {errors.general && (
          <div className="auth-form-error-section">
            <div>
            <CircleX size={18} className="auth-form-error-icon" />
            </div>
            <div>
              <h4 className='err-text'>Error</h4>
              <p style={{ fontSize: '12px' }}>{errors.general}</p>
            </div>
          </div>
        )}

        <FormInput
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter Email address"
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter Password"
          error={errors.password}
        />

        <p className="forgot-password-text" onClick={() => navigate('/forgot-password')}>
          Forgot password?
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button text="Login" type="submit"  />
        </div>
      </form>
      {/* <Modal
        isOpen={showModal}
        title="Success"
        message="Your changes have been successfully saved."
        icon="success"
        iconClose
        buttons={[
          {
            label: 'Cancel',
            style: 'btn-secondary',
            action: () => setShowModal(false)
          },
          {
            label: 'Confirm',
            style: 'btn-primary',
            action: handleConfirm
          }
        ]}
        onClose={() => setShowModal(false)}
      />
      {loading && <Loader />} */}
    </div>
    
  );
};

export default Login;
