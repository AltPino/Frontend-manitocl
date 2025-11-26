import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./registerOrganizacion.css";

export default function RegisterOrganizacion() {
  const navigate = useNavigate();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    contrasena: "",
    tipo_usuario: "organizacion",

    // Datos de organización
    nombre_organizacion: "",
    rut_organizacion: "",
    nombre_representante: "",
    correo_contacto: "",
    telefono: "",
    ubicacion: "",
    descripcion: "",
    sitio_web: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!aceptaTerminos) {
      alert("Debes aceptar los Términos y Condiciones");
      return;
    }

    try {
      await api.post("/auth/register", form);

      setMensaje(
        "¡Organización registrada correctamente! Espera validación del admin."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al registrar organización"
      );
    }
  };

  return (
    <div className="org-register-wrapper">
      <div className="org-register-container">
        <h2>Registro de Organización</h2>

        {error && <p className="error">{error}</p>}
        {mensaje && <p className="exito">{mensaje}</p>}

        <form onSubmit={handleSubmit}>
          <h3>Datos del Responsable</h3>
          <input
            type="text"
            placeholder="Nombre del representante legal"
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Correo electronico de acceso"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            required
          />

          <h3>Datos de la Organización</h3>

          <input
            type="text"
            placeholder="Nombre de la organización"
            name="nombre_organizacion"
            value={form.nombre_organizacion}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="RUT de la organización"
            name="rut_organizacion"
            value={form.rut_organizacion}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Nombre del representante legal"
            name="nombre_representante"
            value={form.nombre_representante}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            placeholder="Correo de contacto"
            name="correo_contacto"
            value={form.correo_contacto}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Ubicación (dirección o región-comuna)"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            required
          />

          <textarea
            placeholder="Descripción de la organización"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Sitio Web (opcional)"
            name="sitio_web"
            value={form.sitio_web}
            onChange={handleChange}
          />

          <div className="terminos-box">
            <label className="terminos-label">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
              />
              <span className="check-custom"></span>

              <span className="terminos-text">
                Acepto los{" "}
                <span
                  className="terminos-link"
                  onClick={() => navigate("/terminos")}
                >
                  Términos y Condiciones
                </span>
              </span>
            </label>
          </div>

          <button type="submit" className="btn-registrar">
            Registrar organización
          </button>
        </form>
      </div>
    </div>
  );
}
