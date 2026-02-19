import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Logo from '../../../assets/logo.png';
import { CircleX, Info } from 'lucide-react';
import { AuthContext } from '../../../Context/Auth/AuthContext';
import Loader from '../../../Components/Loader/loader';
import Button from '../../../Components/Button/button'
import FormInput from '../../../Components/FormInput/FormInput';
import Modal from '../../../Components/Modal/modal';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isFirstTime, setIsFirstTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';

    if (!form.email && !form.password) {
      setErrors({ general: 'Email and password are required' });
      return;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await login(form);
      setIsFirstTime(response.data.is_temporary_password);

      setModal({
        open: true,
        type: 'success',
        title: 'Login',
        message: response.message
      });
  
      setTimeout(() => {
        if (response.data.is_temporary_password) {
          navigate('/create-password');
        } else {
          navigate('/dashboard');
        }
      }, 500);

    } catch (err) {
      setModal({
        open: true,
        type: 'error',
        title: 'Login failed',
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form-card" onSubmit={handleLogin}>
        <img src={Logo} alt="Logo" className="auth-form-logo" />

        {/* <h2 className="welcome-text-title">{isFirstTime ? 'Welcome' : ''}</h2> */}
        <h2 className="auth-form-subtitle">Centralized Survey Monitoring System</h2>

        {errors.general && (
          <div className="auth-form-error-section">
            <CircleX size={18} /><p>{errors.general}</p>
          </div>
        )}

        <FormInput
          label="Email Address"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
          error={errors.email}
        />

        <FormInput
          label={isFirstTime ? 'Temporary Password' : 'Password'}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          error={errors.password}
        />

        {/* {!isFirstTime && ( */}
          <p className="forgot-password-text" onClick={() => navigate('/forgot-password')}>
            Forgot password?
          </p>
        {/* )} */}

        {/* {isFirstTime && (
          <div className="auth-helper-div">
            <Info size={40} fill='#2259A9' color='white'/>
            <p className="auth-helper-text">Enter the temporary password sent to your email. You'll create a new password in the next step.</p>
          </div>
        )} */}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            text={isFirstTime ? 'Proceed' : 'Login'}
            type="submit"
            disabled={loading}
          />
        </div>
        {loading && <Loader/>}
      </form>

      <Modal
        isOpen={modal.open}
        icon={modal.type}
        title={modal.title}
        message={modal.message}
        iconClose
        onClose={() => setModal({ ...modal, open: false })}
      />

    </div>
  );
};

export default Login;
