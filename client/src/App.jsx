
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import Login from "./pages/Login";
import Vault from "./pages/Vault";

// ==========================================
// 🔐 PROTECTED ROUTE
// Only logged-in users can access the vault
// ==========================================

const Private = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

// ==========================================
// 🎀 PAGE TRANSITION WRAPPER
// Adds a smooth entrance animation on navigation
// ==========================================

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition">
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
    </div>
  );
}

// ==========================================
// 🎀 MAIN LOCKR APPLICATION
// ==========================================

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
