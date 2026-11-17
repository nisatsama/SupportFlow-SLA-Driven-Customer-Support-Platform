import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import EditTicket from "./pages/EditTicket";
import TicketDetails from "./pages/TicketDetails";

const isAuthenticated = () => Boolean(localStorage.getItem("token"));

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/user-home" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id/edit"
          element={
            <ProtectedRoute>
              <EditTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
