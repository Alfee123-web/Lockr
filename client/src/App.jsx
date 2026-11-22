import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Vault from "./pages/Vault";

// Only lets logged-in users see the page
const Private = ({ children }) =>
  localStorage.getItem("token") ? children : <Navigate to="/login" replace />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Private>
              <Vault />
            </Private>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}