import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import Landing from "./pages/LandingPage/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
