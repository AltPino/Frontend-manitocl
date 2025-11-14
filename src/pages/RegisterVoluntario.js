import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./registerVoluntario.css";

export default function RegisterVoluntario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    contrasena: "",
    rut: "",
    fecha_nacimiento: "",
    genero: "",
    region: "",
    comuna: "",
  });

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Cargar regiones al iniciar
  useEffect(() => {
    api.get("/regiones").then((res) => setRegiones(res.data));
  }, []);

  // Cargar comunas según región elegida
  const cargarComunas = async (regionNombre) => {
    const regionObj = regiones.find((r) => r.nombre === regionNombre);
    if (!regionObj) {
      setComunas([]);
      return;
    }

    const res = await api.get(`/comunas/${regionObj.id_region}`);
    setComunas(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia la región, recargamos comunas y limpiamos la seleccionada
    if (name === "region") {
      setForm((prev) => ({ ...prev, region: value, comuna: "" }));
      cargarComunas(value);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      await api.post("/auth/register", {
        ...form,
        tipo_usuario: "voluntario",
      });

      setMensaje("¡Voluntario registrado exitosamente!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar voluntario");
    }
  };

  return (
    <div className="registro-wrapper">
      <h2>Registro de Voluntario</h2>

      {error && <p className="error">{error}</p>}
      {mensaje && <p className="exito">{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre_completo"
          placeholder="Nombre completo"
          value={form.nombre_completo}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="rut"
          placeholder="RUT (ej: 12345678-9)"
          value={form.rut}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="fecha_nacimiento"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          required
        />

        <select
          name="genero"
          value={form.genero}
          onChange={handleChange}
          required
        >
          <option value="">Género</option>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
          <option value="personalizado">Personalizado</option>
        </select>

        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          required
        >
          <option value="">Región</option>
          {regiones.map((r) => (
            <option key={r.id_region} value={r.nombre}>
              {r.nombre}
            </option>
          ))}
        </select>

        <select
          name="comuna"
          value={form.comuna}
          onChange={handleChange}
          required
        >
          <option value="">Comuna</option>
          {comunas.map((c) => (
            <option key={c.id_comuna} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>

        <button type="submit">Crear cuenta</button>
      </form>
    </div>
  );
}
