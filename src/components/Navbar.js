import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname.startsWith("/admin")) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const NavbarInvitado = () => (
    <div className="navbar-links">
      <NavLink
        to="/"
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Inicio
      </NavLink>

      <NavLink
        to="/oportunidades"
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Oportunidades
      </NavLink>

      <NavLink
        to="/nosotros"
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Nosotros
      </NavLink>
    </div>
  );

  const NavbarVoluntario = () => (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>
        Inicio
      </Link>
      <Link to="/oportunidades" onClick={() => setMenuOpen(false)}>
        Oportunidades
      </Link>
      <Link to="/perfil" onClick={() => setMenuOpen(false)}>
        Mi Perfil
      </Link>
    </>
  );

  const NavbarOrganizacion = () => (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>
        Inicio
      </Link>
      <Link to="/organizacion" onClick={() => setMenuOpen(false)}>
        Dashboard
      </Link>
      <Link to="/organizacion/convocatorias" onClick={() => setMenuOpen(false)}>
        Convocatorias
      </Link>
      <Link to="/organizacion/postulaciones" onClick={() => setMenuOpen(false)}>
        Postulaciones
      </Link>
      <Link to="/organizacion/perfil" onClick={() => setMenuOpen(false)}>
        Perfil
      </Link>
    </>
  );

  const renderLinks = () => {
    if (!usuario) return <NavbarInvitado />;
    if (usuario.tipo === "organizacion") return <NavbarOrganizacion />;
    if (usuario.tipo === "voluntario") return <NavbarVoluntario />;
    return <NavbarInvitado />;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Manito.<span>cl</span>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* MENÚ */}
        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <div className="navbar-links">{renderLinks()}</div>

          <div className="navbar-actions">
            {!usuario ? (
              <>
                <Link
                  to="/login"
                  className="btn-outline"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>

                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <span className="navbar-user">{usuario.nombre}</span>
                <button className="btn-logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
