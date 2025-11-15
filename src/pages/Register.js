import React from "react";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>¿Qué tipo de cuenta quieres crear?</h2>
        <p>Selecciona el tipo de usuario para continuar:</p>

        <div className="register-buttons">
          <Link to="/register/voluntario">
            <button className="register-btn">Voluntario</button>
          </Link>

          <Link to="/register/organizacion">
            <button className="register-btn">Organización</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
