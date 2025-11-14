import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          Manito.cl
        </Link>

        <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/convocatorias">Oportunidades</Link>
          <Link to="/nosotros">Nosotros</Link>
        </nav>

        <div className="nav-buttons">
          <Link to="/login" className="btn-login">Iniciar Sesión</Link>
          <Link to="/register" className="btn-register">Registrarse</Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
