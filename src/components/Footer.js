import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Manito.cl</h3>
          <p>
            Conectando voluntarios con organizaciones para crear impacto real.
          </p>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>
          <p>Email: contacto@manito.cl</p>
          <p>Teléfono: +56 9 1234 5678</p>
          <p>Santiago, Chile</p>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        © {new Date().getFullYear()} Manito.cl — Todos los derechos reservados.
      </div>
    </footer>
  );
}
