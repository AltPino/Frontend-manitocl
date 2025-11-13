import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardOrganizacion() {
  const { usuario, logout } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;
    // Cargar convocatorias creadas por esta organización
    api
      .get(`/convocatorias?organizacion=${usuario.id}`)
      .then((res) => setConvocatorias(res.data))
      .catch(() => console.error("Error al cargar convocatorias"))
      .finally(() => setCargando(false));
  }, [usuario]);

  const crearConvocatoria = async () => {
    const titulo = prompt("Título de la nueva convocatoria:");
    const descripcion = prompt("Descripción breve:");
    if (!titulo || !descripcion) return;

    try {
      await api.post("/convocatorias", {
        id_organizacion: usuario.id,
        titulo,
        descripcion,
        ubicacion: "Iquique"
      });
      alert("Convocatoria creada correctamente.");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear convocatoria.");
    }
  };

  if (!usuario) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", marginTop: "40px" }}>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <p>Tipo de cuenta: <b>{usuario.tipo}</b></p>
      <button onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</button>

      <hr />
      <h3>Tus convocatorias</h3>
      <button onClick={crearConvocatoria}>+ Nueva Convocatoria</button>

      {cargando ? (
        <p>Cargando convocatorias...</p>
      ) : convocatorias.length === 0 ? (
        <p>No has creado ninguna convocatoria aún.</p>
      ) : (
        <ul>
          {convocatorias.map((c) => (
            <li key={c.id_convocatoria} style={{ marginBottom: "15px" }}>
              <h4>{c.titulo}</h4>
              <p>{c.descripcion}</p>
              <p><b>Estado:</b> {c.estado}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
