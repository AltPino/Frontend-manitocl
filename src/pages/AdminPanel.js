import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { usuario } = useContext(AuthContext);

  const [vista, setVista] = useState("organizaciones"); // por defecto
  const [organizaciones, setOrganizaciones] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  // ======== Cargar datos según la vista ========
  useEffect(() => {
    if (vista === "organizaciones") cargarOrganizaciones();
    if (vista === "convocatorias") cargarConvocatorias();
    if (vista === "voluntarios") cargarVoluntarios();
  }, [vista]);

  const cargarOrganizaciones = async () => {
    const res = await api.get("/admin/organizaciones/pendientes");
    setOrganizaciones(res.data);
  };

  const cargarConvocatorias = async () => {
    const res = await api.get("/admin/convocatorias");
    setConvocatorias(res.data);
  };

  const cargarVoluntarios = async () => {
    const res = await api.get("/admin/voluntarios");
    setVoluntarios(res.data);
  };

  // ======== Acciones ========
  const aprobarOrg = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, { estado: "activo" });
    cargarOrganizaciones();
  };

  const rechazarOrg = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, { estado: "rechazado" });
    cargarOrganizaciones();
  };

  const cambiarEstadoConv = async (id, estado) => {
    await api.put(`/admin/convocatorias/estado/${id}`, { estado });
    cargarConvocatorias();
  };

  const eliminarConv = async (id) => {
    await api.delete(`/admin/convocatorias/eliminar/${id}`);
    cargarConvocatorias();
  };

  const cambiarEstadoVol = async (id, estado) => {
    await api.put(`/admin/voluntarios/estado/${id}`, { estado });
    cargarVoluntarios();
  };

  // ==========================================
  if (!usuario) return <p>Cargando...</p>;
  return (
    <div className="admin-wrapper">
      {/* =============== SIDEBAR =============== */}
      <aside className="sidebar">
        <h2>Panel Admin</h2>

        <button onClick={() => setVista("organizaciones")}
                className={vista === "organizaciones" ? "active" : ""}>
          Organizaciones
        </button>

        <button onClick={() => setVista("convocatorias")}
                className={vista === "convocatorias" ? "active" : ""}>
          Convocatorias
        </button>

        <button onClick={() => setVista("voluntarios")}
                className={vista === "voluntarios" ? "active" : ""}>
          Voluntarios
        </button>
        <hr />
      </aside>

      {/* =============== CONTENIDO =============== */}
      <main className="contenido">

        {vista === "organizaciones" && (
          <div>
            <h2>Organizaciones Pendientes</h2>

            {organizaciones.length === 0 ? (
              <p>No hay organizaciones pendientes.</p>
            ) : (
              organizaciones.map((o) => (
                <div className="admin-card" key={o.id_organizacion}>
                  <h3>{o.nombre_organizacion}</h3>
                  <p><strong>Email:</strong> {o.correo_contacto}</p>
                  <p><strong>Teléfono:</strong> {o.telefono}</p>

                  <button onClick={() => aprobarOrg(o.id_organizacion)}>Aprobar</button>
                  <button className="rechazar" onClick={() => rechazarOrg(o.id_organizacion)}>Rechazar</button>
                </div>
              ))
            )}
          </div>
        )}

        {vista === "convocatorias" && (
          <div>
            <h2>Convocatorias</h2>

            {convocatorias.map((c) => (
              <div className="admin-card" key={c.id_convocatoria}>
                <h3>{c.titulo}</h3>
                <p><strong>Organización:</strong> {c.nombre_organizacion}</p>
                <p><strong>Estado:</strong> {c.estado}</p>

                <button onClick={() => cambiarEstadoConv(c.id_convocatoria, "activa")}>Activar</button>
                <button onClick={() => cambiarEstadoConv(c.id_convocatoria, "cerrada")}>Cerrar</button>
                <button className="eliminar" onClick={() => eliminarConv(c.id_convocatoria)}>Eliminar</button>
              </div>
            ))}
          </div>
        )}

        {vista === "voluntarios" && (
          <div>
            <h2>Voluntarios</h2>

            {voluntarios.map((v) => (
              <div className="admin-card" key={v.id_voluntario}>
                <h3>{v.nombre_completo}</h3>
                <p><strong>Email:</strong> {v.email}</p>
                <p><strong>Nivel:</strong> {v.nivel}</p>
                <p><strong>Puntos:</strong> {v.puntos}</p>

                <button onClick={() => cambiarEstadoVol(v.id_voluntario, "activo")}>Activar</button>
                <button className="eliminar" onClick={() => cambiarEstadoVol(v.id_voluntario, "eliminado")}>Desactivar</button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
