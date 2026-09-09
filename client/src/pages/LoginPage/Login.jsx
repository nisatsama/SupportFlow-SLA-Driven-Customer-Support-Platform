import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store user information if returned by backend
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect after successful login
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Section */}
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">🎫</div>
          <h1>HelpDesk</h1>
        </div>

        <div className="welcome-content">
          <h2>Welcome Back!</h2>

          <p>
            Sign in to manage your support tickets, track requests and get help
            faster.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span>✓</span>
              <p>Manage support tickets</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Track ticket status</p>
            </div>

            <div className="feature">
              <span>✓</span>
              <p>Connect with support agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="login-card">
          <h2>Sign In</h2>

          <p className="login-subtitle">Enter your credentials to continue</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="register-link">
            Don't have an account?
            <Link to="/register"> Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
