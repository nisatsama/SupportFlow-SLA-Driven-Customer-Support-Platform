import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));

    const role = payload.role;

    if (role === "user") {
      navigate("/user-dashboard");
    } else if (role === "support") {
      navigate("/support-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Loading dashboard...</p>;
};

export default Dashboard;
