// src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">Manito.cl</Link>

        <Link to="/">Inicio</Link>
        <Link to="/oportunidades">Oportunidades</Link>
        <Link to="/nosotros">Nosotros</Link>
      </div>

      <div className="navbar-right">
        {/* Si NO hay usuario => mostrar Login & Register */}
        {!usuario && (
          <>
            <Link to="/login" className="btn-login">Iniciar Sesión</Link>
            <Link to="/register" className="btn-register">Registrarse</Link>
          </>
        )}

        {/* Si SÍ hay usuario => mostrar logout */}
        {usuario && (
          <>
            <span className="navbar-user">
              {usuario.nombre?.split(" ")[0] || "Usuario"}
            </span>

            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
