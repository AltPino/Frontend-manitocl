import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardVoluntario from "./pages/DashboardVoluntario";
import DashboardOrganizacion from "./pages/DashboardOrganizacion";
import AdminPanel from "./pages/AdminPanel";
import RegisterVoluntario from "./pages/RegisterVoluntario";
import RegisterOrganizacion from "./pages/RegisterOrganizacion";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/voluntario" element={<DashboardVoluntario />} />
          <Route path="/register/voluntario" element={<RegisterVoluntario />} />
          <Route path="/register/organizacion" element={<RegisterOrganizacion />} />
          <Route path="/organizacion" element={<DashboardOrganizacion />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
