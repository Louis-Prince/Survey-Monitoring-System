import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../Components/formInput';
import Button from '../../Components/button';
import '../../CSS/login.css';
import { AuthContext } from '../../Context/Auth/AuthContext';
import Logo from '../../assets/logo.png';

const CreatePassword = ({
  title,
  description,
  mode
}) => {
  const navigate = useNavigate();
  const { createPassword, resetPassword } = useContext(AuthContext);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
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

    setLoading(true);

    const payload = { password: form.password };

    const response =
      mode === 'create'
        ? await createPassword(payload)
        : await resetPassword(payload);

    setLoading(false);

    if (response.success) {
      navigate('/');
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
            text={loading ? 'Processing...' : 'Create New Password'}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePassword;
