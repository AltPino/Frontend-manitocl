import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { usuario, logout } = useContext(AuthContext);
  const [pendientes, setPendientes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/admin/organizaciones/pendientes")
      .then((res) => setPendientes(res.data))
      .catch(() => console.error("Error al cargar organizaciones pendientes"));
  }, []);

  const aprobar = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, { estado: "activo" });
    setPendientes((prev) => prev.filter((o) => o.id_organizacion !== id));
  };

  const rechazar = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, { estado: "rechazado" });
    setPendientes((prev) => prev.filter((o) => o.id_organizacion !== id));
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", marginTop: "40px" }}>
      <h2>Panel del Administrador</h2>
      <button onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</button>
      <hr />
      <h3>Organizaciones pendientes de aprobación</h3>

      {pendientes.length === 0 ? (
        <p>No hay organizaciones pendientes.</p>
      ) : (
        pendientes.map((o) => (
          <div key={o.id_organizacion} style={{ marginBottom: "15px" }}>
            <h4>{o.nombre_organizacion}</h4>
            <p>Email: {o.correo_contacto}</p>
            <button onClick={() => aprobar(o.id_organizacion)}>Aprobar</button>
            <button onClick={() => rechazar(o.id_organizacion)}>Rechazar</button>
          </div>
        ))
      )}
    </div>
  );
}
