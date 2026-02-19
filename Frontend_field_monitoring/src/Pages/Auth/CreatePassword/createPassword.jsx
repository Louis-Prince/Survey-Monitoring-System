import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Login/login.css';
import './createPassword.css';
import Logo from '../../../assets/logo.png';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import { AuthContext } from '../../../Context/Auth/AuthContext';
import Loader from '../../../Components/Loader/loader';
import Button from '../../../Components/Button/button';
import FormInput from '../../../Components/FormInput/FormInput';
import Modal from '../../../Components/Modal/modal';

const passwordRules = {
  minLength: 8,
  hasLetter: /[a-zA-Z]/,
  hasUppercase: /[A-Z]/, 
  hasNumber: /[0-9]/,
  hasSymbol: /[^a-zA-Z0-9]/,
};

const validatePassword = (password) => ({
  length: password.length >= passwordRules.minLength,
  letter: passwordRules.hasLetter.test(password),
  uppercase: passwordRules.hasUppercase.test(password),
  number: passwordRules.hasNumber.test(password),
  symbol: passwordRules.hasSymbol.test(password),
});

const CreatePassword = ({
  title,
  description,
  mode
}) => {
  const navigate = useNavigate();
  const { createPassword, resetPassword } = useContext(AuthContext);
  const timeoutRef = useRef(null);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: 'info',
    title: '',
    message: ''
  });
  const { uid, token } = useParams();

  const passwordValidation = validatePassword(form.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleModalClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (modal.type === 'error' &&  modal.message && modal.message.includes('Password has already been changed')) {
      navigate('/');
    }
    
    setModal({ ...modal, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!isPasswordValid) {
      setErrors({ password: 'Password does not meet requirements' });
      return;
    }

    try {
      setLoading(true);
    
      const payload = {
        new_password: form.password,
        confirm_new_password: form.confirmPassword
      };    
      if (mode === "reset") {
        payload.uid = uid;
        payload.token = token;
      }

      const response = mode === 'create' ? await createPassword(payload) : await resetPassword(payload);

      setModal({
        open: true,
        type: 'success',
        title: 'Password Created',
        message: response.message
      });
    
      timeoutRef.current = setTimeout(() => {
        if (response.success) {
          navigate('/');
        }
      }, 3000);

    } catch (err) {
      setModal({
        open: true,
        type: 'error',
        title: 'Password Creation Failed',
        message: err.message
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form-card" onSubmit={handleSubmit}>
        <img src={Logo} alt="Logo" className="auth-form-logo" />
        <h2 style={{color: 'var(--primary-color)', fontSize: '22px'}}>{title}</h2>
        <p style={{fontSize:'13px', color:'grey', textAlign:'center', marginBottom:'30px'}}>{description}</p>

        <FormInput
          label="New Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter new password"
          error={errors.password}
        />
        {form.password.length > 0 &&(<div className="password-rules">
          <div className="password-rules-title">
            <Info size={16} />
            <span>Password requirements</span>
          </div>
        
          <ul>
            <li className={passwordValidation.length ? 'valid' : 'invalid'}>
              {passwordValidation.length ? <CheckCircle size={14} /> : <XCircle size={14} />}
              At least 8 characters
            </li>
        
            <li className={passwordValidation.letter ? 'valid' : 'invalid'}>
              {passwordValidation.letter ? <CheckCircle size={14} /> : <XCircle size={14} />}
              Contains letters
            </li>

            <li className={passwordValidation.uppercase ? 'valid' : 'invalid'}>
              {passwordValidation.uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
              Contains uppercase letters
            </li>
        
            <li className={passwordValidation.number ? 'valid' : 'invalid'}>
              {passwordValidation.number ? <CheckCircle size={14} /> : <XCircle size={14} />}
              Contains numbers
            </li>
        
            <li className={passwordValidation.symbol ? 'valid' : 'invalid'}>
              {passwordValidation.symbol ? <CheckCircle size={14} /> : <XCircle size={14} />}
              Contains symbols
            </li>
          </ul>
        </div>)}

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="confirm new password"
          error={errors.confirmPassword}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            type="submit"
            text="Create New Password"
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
        onClose={handleModalClose}
      />
    </div>
  );
};

export default CreatePassword;
