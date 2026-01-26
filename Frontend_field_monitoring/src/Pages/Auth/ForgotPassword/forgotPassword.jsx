import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../Login/login.css";
import Logo from "../../../assets/logo.png";
import { CircleX, Info } from "lucide-react";
import Loader from "../../../Components/Loader/loader";
import Button from "../../../Components/Button/button";
import FormInput from "../../../Components/FormInput/FormInput";

const ForgotPassword = () => {
//   const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // API call goes here
      // await requestPasswordReset(email);

      setSuccess(true);
    } catch (err) {
      setErrors({ general: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form-card" onSubmit={handleSubmit}>
        <img src={Logo} alt="Logo" className="auth-form-logo" />

        <h2 className="auth-form-subtitle">
          Centralized Survey Monitoring System
        </h2>

        {errors.general && (
          <div className="auth-form-error-section">
            <CircleX size={18} />
            <p>{errors.general}</p>
          </div>
        )}

        {success ? (
          <div className="auth-helper-div">
            <Info size={40} fill="#2259A9" color="white" />
            <p className="auth-helper-text">
              If an account exists with this email, a password reset link has
              been sent. Please check your inbox.
            </p>
          </div>
        ) : (
          <>
            <FormInput
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              error={errors.email}
            />

            <div className="auth-helper-div">
              <Info size={40} fill="#2259A9" color="white" />
              <p className="auth-helper-text">
                Enter the email associated with your account. We’ll send you a
                link to reset your password.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                text="Send reset link"
                type="submit"
                disabled={loading}
              />
            </div>
          </>
        )}

        {loading && <Loader />}
      </form>
    </div>
  );
};

export default ForgotPassword;
