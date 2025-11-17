import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardVoluntario() {
  const { usuario, logout } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  // 🚫 PROTEGER RUTA SOLO PARA VOLUNTARIOS
  useEffect(() => {
    if (!usuario) return; // aún cargando usuario

    if (usuario.tipo !== "voluntario") {
      navigate("/login");
    }
  }, [usuario, navigate]);

  useEffect(() => {
    if (!usuario) return;
    // Cargar convocatorias públicas
    api
      .get("/convocatorias")
      .then((res) => setConvocatorias(res.data))
      .catch(() => console.error("Error al cargar convocatorias"))
      .finally(() => setCargando(false));
  }, [usuario]);

  if (!usuario) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", marginTop: "40px" }}>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <p>
        Tipo de cuenta: <b>{usuario.tipo}</b>
      </p>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Cerrar sesión
      </button>

      <hr />
      <h3>Convocatorias activas</h3>

      {cargando ? (
        <p>Cargando convocatorias...</p>
      ) : convocatorias.length === 0 ? (
        <p>No hay convocatorias disponibles por ahora.</p>
      ) : (
        <ul>
          {convocatorias.map((c) => (
            <li key={c.id_convocatoria} style={{ marginBottom: "15px" }}>
              <h4>{c.titulo}</h4>
              <p>{c.descripcion}</p>
              <p>
                <b>Organización:</b> {c.nombre_organizacion}
              </p>
              <p>
                <b>Ubicación:</b> {c.ubicacion}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
