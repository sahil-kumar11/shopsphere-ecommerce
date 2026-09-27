import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { loginUser, registerUser } from "../services/api";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSignupMode = searchParams.get("mode") === "signup";
  const [isLogin, setIsLogin] = useState(!isSignupMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccessMessage("");
  };

  const validateForm = () => {
    const next = {};
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = "Please enter a valid email address";

    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 6) next.password = "Password must be at least 6 characters";

    if (!isLogin) {
      if (!formData.name.trim()) next.name = "Full name is required";
      else if (formData.name.trim().length < 2) next.name = "Name must be at least 2 characters";
      if (!formData.confirmPassword) next.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords do not match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});
      if (isLogin) {
        await loginUser(formData.email.trim(), formData.password);
        setSuccessMessage("Welcome back! Redirecting...");
      } else {
        await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        setSuccessMessage("Account created successfully! Redirecting...");
      }
      setTimeout(() => navigate("/account"), 500);
    } catch (error) {
      setErrors({ form: error.message || "Authentication failed. Please try again." });
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const next = !isLogin;
    setIsLogin(next);
    setErrors({});
    setSuccessMessage("");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    navigate(next ? "/auth" : "/auth?mode=signup", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">shop<span>•</span>sphere</Link>
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p>{isLogin ? "Sign in to access your account" : "Join ShopSphere and start shopping"}</p>
          </div>

          {successMessage && <div className="auth-success"><CheckCircle size={18} /><span>{successMessage}</span></div>}
          {errors.form && <div className="error-message"><AlertCircle size={14} />{errors.form}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className={`input-wrapper ${errors.name ? "error" : ""}`}>
                  <User size={18} className="input-icon" />
                  <input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} disabled={isLoading} />
                </div>
                {errors.name && <span className="error-message"><AlertCircle size={14} />{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
                <Mail size={18} className="input-icon" />
                <input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} disabled={isLoading} />
              </div>
              {errors.email && <span className="error-message"><AlertCircle size={14} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
                <Lock size={18} className="input-icon" />
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleChange} disabled={isLoading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} disabled={isLoading}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error-message"><AlertCircle size={14} />{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
                  <Lock size={18} className="input-icon" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} disabled={isLoading}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message"><AlertCircle size={14} />{errors.confirmPassword}</span>}
              </div>
            )}

            {isLogin && <div className="forgot-password"><Link to="/forgot-password">Forgot Password?</Link></div>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="auth-loading"><span className="spinner" />{isLogin ? "Signing in..." : "Creating account..."}</span>
              ) : (
                <>{isLogin ? "Sign In" : "Create Account"}<ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-toggle">
            <p>{isLogin ? "Don't have an account?" : "Already have an account?"} <button type="button" onClick={toggleMode} disabled={isLoading}>{isLogin ? "Sign Up" : "Sign In"}</button></p>
          </div>
        </div>
        <p className="auth-footer">By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></p>
      </div>
    </div>
  );
}

export default Auth;
