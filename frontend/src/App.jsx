import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHome from "./pages/UserHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserHome />} />

        {/* We'll implement this later */}
        <Route
          path="/tickets/:id"
          element={<div>Ticket Details - Coming Soon</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
