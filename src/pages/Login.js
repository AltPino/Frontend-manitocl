import React, { useState, useContext } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await api.post("/auth/login", { email, contrasena });

      // 🔥 ACTUALIZA EL AuthContext inmediatamente
      login(res.data);

      const tipo = res.data.usuario.tipo;

      if (tipo === "voluntario") navigate("/");
      else if (tipo === "organizacion") navigate("/organizacion");
      else if (tipo === "admin") navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }

    setCargando(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="registro-txt">
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}
