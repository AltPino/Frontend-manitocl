import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-content">
        <h4>Manito.cl</h4>
        <p>Conectando voluntarios con organizaciones que necesitan ayuda.</p>

        <div className="footer-links">
          <a href="/sobre">Sobre nosotros</a>
          <a href="/terminos">Términos y Condiciones</a>
          <a href="/privacidad">Política de Privacidad</a>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} Manito.cl — Todos los derechos reservados.</p>
      </div>

    </footer>
  );
};

export default Footer;
