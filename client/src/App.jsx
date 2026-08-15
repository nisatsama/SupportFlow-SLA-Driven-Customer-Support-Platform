import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/RegisterPage/Register";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/LoginPage/Login";

import Dashboard from "./components/Dashboard";

import UserDashboard from "./pages/DashboardPage/UserDashboard";
import AdminDashboard from "./pages/DashboardPage/AdminDashboard";
import SupportDashboard from "./pages/DashboardPage/SupportDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* General Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Support Dashboard */}
        <Route
          path="/support-dashboard"
          element={
            <ProtectedRoute allowedRoles={["support"]}>
              <SupportDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
