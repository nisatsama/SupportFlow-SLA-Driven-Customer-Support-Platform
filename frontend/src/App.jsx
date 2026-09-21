import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import EditTicket from "./pages/EditTicket";
import TicketDetails from "./pages/TicketDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* First page when opening localhost:5173 */}
        <Route path="/" element={<Register />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* User Home */}
        <Route path="/user-home" element={<UserHome />} />

        {/* Edit Ticket */}
        <Route path="/tickets/:id/edit" element={<EditTicket />} />

        {/* Unknown routes → Register */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
