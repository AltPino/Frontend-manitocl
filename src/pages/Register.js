import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>¿Qué tipo de cuenta quieres crear?</h2>
      <p>Selecciona el tipo de usuario para continuar:</p>
      <Link to="/register/voluntario">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Voluntario</button>
      </Link>
      <Link to="/register/organizacion">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Organización</button>
      </Link>
    </div>
  );
}
