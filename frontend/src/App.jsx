import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHome from "./pages/UserHome";
import TicketCard from "./components/TicketCard";
import EditTicket from "./pages/EditTicket";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />

        {/* View ticket */}
        <Route path="/tickets/:id" element={<TicketCard />} />

        {/* Edit ticket */}
        <Route path="/tickets/:id/edit" element={<EditTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
