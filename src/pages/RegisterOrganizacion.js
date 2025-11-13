import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function RegisterOrganizacion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        nombre_completo: nombre,
        email,
        contrasena,
        tipo_usuario: "organizacion"
      });
      setMensaje("Cuenta de organización registrada. Espera la aprobación del administrador.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar organización");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "100px" }}>
      <h2>Registro de Organización</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre de la organización" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <br /><br />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        <br /><br />
        <button type="submit">Registrar organización</button>
      </form>
    </div>
  );
}
