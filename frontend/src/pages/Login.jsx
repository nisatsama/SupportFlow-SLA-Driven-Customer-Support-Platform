import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
      );

      const token = response.data.token;

      // Save JWT
      localStorage.setItem("token", token);

      // Decode JWT
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );

      // Save role
      localStorage.setItem("role", payload.role);

      console.log("Logged in user:", payload.sub);
      console.log("Logged in role:", payload.role);

      // Both ADMIN and USER go to the same dashboard
      navigate("/user-home");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your HelpDesk account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         outline-none transition
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3
                         outline-none transition
                         focus:border-blue-500
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3
                       font-semibold text-white
                       transition hover:bg-blue-700
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500 focus:ring-offset-2
                       disabled:cursor-not-allowed
                       disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
