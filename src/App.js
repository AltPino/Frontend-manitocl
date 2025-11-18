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
import NuevaConvocatoria from "./pages/NuevaConvocatoria";
import EditarConvocatoria from "./pages/EditarConvocatoria";
import ConvocatoriasOrganizacion from "./pages/ConvocatoriasOrganizacion";
import PostulacionesOrganizacion from "./pages/PostulacionesOrganizacion";
import PerfilOrganizacion from "./pages/PerfilOrganizacion";
import VerConvocatoria from "./pages/VerConvocatoria";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* NAVBAR SIEMPRE ARRIBA */}
        <Navbar />

        {/* CONTENIDO DE PÁGINAS */}
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/voluntario" element={<DashboardVoluntario />} />
            <Route
              path="/register/voluntario"
              element={<RegisterVoluntario />}
            />
            <Route
              path="/register/organizacion"
              element={<RegisterOrganizacion />}
            />
            <Route path="/organizacion" element={<DashboardOrganizacion />} />
            <Route
              path="/organizacion/nueva-convocatoria"
              element={<NuevaConvocatoria />}
            />
            <Route
              path="/organizacion/editar-convocatoria/:id"
              element={<EditarConvocatoria />}
            />
            <Route
              path="/organizacion/convocatorias"
              element={<ConvocatoriasOrganizacion />}
            />
            <Route
              path="/organizacion/postulaciones"
              element={<PostulacionesOrganizacion />}
            />
            <Route
              path="/organizacion/perfil"
              element={<PerfilOrganizacion />}
            />
            <Route path="/convocatoria/:id" element={<VerConvocatoria />} />

            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        {/* FOOTER SIEMPRE ABAJO */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
