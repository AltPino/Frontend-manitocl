import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 🚫 OCULTAR NAVBAR EN TODAS LAS RUTAS /admin
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ============================
  // NAVBAR INVITADO
  // ============================
  const NavbarInvitado = () => (
    <div className="navbar-links">
      <Link to="/">Inicio</Link>
      <Link to="/oportunidades">Oportunidades</Link>
      <Link to="/nosotros">Nosotros</Link>
    </div>
  );

  // ============================
  // NAVBAR VOLUNTARIO
  // ============================
  const NavbarVoluntario = () => (
    <div className="navbar-links">
      <Link to="/voluntario">Inicio</Link>
      <Link to="/oportunidades">Oportunidades</Link>
      <Link to="/perfil">Mi Perfil</Link>
    </div>
  );

  // ============================
  // NAVBAR ORGANIZACIÓN
  // ============================
  const NavbarOrganizacion = () => (
    <div className="navbar-links">
      <Link to="/organizacion">Inicio</Link>
      <Link to="/organizacion/perfil">Perfil</Link>
      <Link to="/organizacion/convocatorias">Convocatorias</Link>
      <Link to="/organizacion/postulaciones">Postulaciones</Link>
    </div>
  );

  // ============================
  // SELECCIONAR NAV
  // ============================
  const renderLinks = () => {
    if (!usuario) return <NavbarInvitado />;
    if (usuario.tipo === "organizacion") return <NavbarOrganizacion />;
    if (usuario.tipo === "voluntario") return <NavbarVoluntario />;
    return <NavbarInvitado />;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          Manito.<span>cl</span>
        </Link>

        {/* LINKS */}
        {renderLinks()}

        {/* DERECHA */}
        <div className="navbar-actions">
          {!usuario && (
            <>
              <Link to="/login" className="btn-outline">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary">
                Registrarse
              </Link>
            </>
          )}

          {usuario && (
            <>
              <span className="navbar-user">{usuario.nombre}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
