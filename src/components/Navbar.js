import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          Manito.<span>cl</span>
        </Link>

        {/* LINKS CENTRALES */}
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/oportunidades">Oportunidades</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>

        {/* ACCIONES DERECHA */}
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
