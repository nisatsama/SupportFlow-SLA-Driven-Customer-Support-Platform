import { BrowserRouter, Routes, Route, Links } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import Landing from "./pages/LandingPage/Landing";
import Login from "./pages/LoginPage/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
