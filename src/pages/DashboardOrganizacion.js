import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./DashboardOrganizacion.css";
import { useNavigate } from "react-router-dom";

export default function DashboardOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [regiones, setRegiones] = useState([]);

  const [metricas, setMetricas] = useState({
    activas: 0,
    finalizadas: 0,
    postulaciones: 0,
    interesados: 0,
  });

  useEffect(() => {
    api.get("/regiones").then((res) => setRegiones(res.data));
  }, []);

  // ================================
  // CARGAR CONVOCATORIAS DE LA ONG
  // ================================
  useEffect(() => {
    if (!usuario?.id) return;

    const obtenerConvocatorias = async () => {
      try {
        const res = await api.get(`/organizacion/convocatorias/${usuario.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setConvocatorias(res.data);
      } catch (error) {
        console.error("Error al cargar convocatorias:", error);
      }
    };

    obtenerConvocatorias();
  }, [usuario]);

  // ================================
  // MÉTRICAS: ACTIVAS - FINALIZADAS - POSTULACIONES
  // ================================
  useEffect(() => {
    if (convocatorias.length === 0) return;

    const activas = convocatorias.filter(
      (c) => c.estado === "activa" || c.estado === "activo"
    ).length;

    const finalizadas = convocatorias.filter(
      (c) => c.estado === "finalizada"
    ).length;

    const obtenerPostulaciones = async () => {
      try {
        let totalPostulaciones = 0;
        let voluntariosInteresados = 0;

        for (const c of convocatorias) {
          const res = await api.get(
            `/postulaciones/convocatoria/${c.id_convocatoria}`
          );

          totalPostulaciones += res.data.length;

          // 🟦 Solo contar interesados reales (NO finalizados)
          voluntariosInteresados += res.data.filter(
            (p) => p.estado !== "finalizado"
          ).length;
        }

        setMetricas({
          activas,
          finalizadas,
          postulaciones: totalPostulaciones,
          interesados: voluntariosInteresados,
        });
      } catch (error) {
        console.error("Error al contar postulaciones:", error);
      }
    };

    obtenerPostulaciones();
  }, [convocatorias]);

  const nombreRegion = (id) => {
    const region = regiones.find((r) => r.id_region === id);
    return region ? region.nombre : id;
  };

  const nombreComuna = (nombre) => {
    return nombre;
  };

  // ================================
  // ELIMINAR CONVOCATORIA
  // ================================
  const eliminarConvocatoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta convocatoria?"))
      return;

    try {
      await api.delete(`/organizacion/convocatorias/${id}`);
      setConvocatorias((prev) => prev.filter((c) => c.id_convocatoria !== id));
    } catch (error) {
      console.error("Error al eliminar convocatoria:", error);
    }
  };

  return (
    <div className="org-wrapper">
      {/* ======= HEADER ======= */}
      <div className="org-header">
        <div className="org-avatar">🏢</div>

        <div>
          <h1 className="org-name">Bienvenido, {usuario?.nombre}</h1>
          <span className="org-badge">Cuenta: Organización</span>
        </div>
      </div>

      {/* ===================================== */}
      {/*        NUEVO DASHBOARD                */}
      {/* ===================================== */}
      <div className="dashboard-org">
        {/* --- Bienvenida secundaria --- */}
        <div className="dash-welcome">
          <h2>Panel de administración</h2>
          <p>Aquí podrás ver un resumen de tus actividades.</p>
        </div>

        {/* --- Métricas --- */}
        <div className="dash-metrics">
          <div className="metric-card">
            <h2>{metricas.activas}</h2>
            <span>Convocatorias activas</span>
          </div>

          <div className="metric-card">
            <h2>{metricas.postulaciones}</h2>
            <span>Postulaciones recibidas</span>
          </div>

          <div className="metric-card">
            <h2>{metricas.finalizadas}</h2>
            <span>Convocatorias finalizadas</span>
          </div>

          <div className="metric-card">
            <h2>{metricas.interesados}</h2>
            <span>Voluntarios interesados</span>
          </div>
        </div>

        {/* --- Accesos rápidos --- */}
        <div className="dash-quick">
          <button
            className="quick-btn"
            onClick={() => navigate("/organizacion/nueva-convocatoria")}
          >
            ➕ Nueva Convocatoria
          </button>

          <button
            className="quick-btn"
            onClick={() => navigate("/organizacion/convocatorias")}
          >
            📄 Ver Convocatorias
          </button>

          <button
            className="quick-btn"
            onClick={() => navigate("/organizacion/postulaciones")}
          >
            👥 Ver Postulaciones
          </button>

          <button
            className="quick-btn"
            onClick={() => navigate("/organizacion/perfil")}
          >
            🧾 Editar Perfil
          </button>
        </div>

        {/* --- Actividad reciente --- */}
        <div className="dash-activity">
          <h3>Actividades recientes</h3>
          <p className="activity-empty">Aún no hay actividad registrada.</p>
        </div>
      </div>

      {/* ===================================== */}
      {/*       SECCIÓN: ÚLTIMAS 3 CONVOCATORIAS */}
      {/* ===================================== */}
      <div className="org-section">
        <div className="section-header">
          <h2>Últimas Convocatorias</h2>

          <button
            className="btn-primary-org"
            onClick={() => navigate("/organizacion/nueva-convocatoria")}
          >
            + Nueva Convocatoria
          </button>
        </div>

        {convocatorias.length === 0 ? (
          <p className="no-convocatorias">
            No has creado ninguna convocatoria aún.
          </p>
        ) : (
          <div className="conv-grid">
            {[...convocatorias]
              .sort(
                (a, b) =>
                  new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
              )
              .slice(0, 3)
              .map((c) => (
                <div key={c.id_convocatoria} className="conv-card">
                  {c.imagen && (
                    <img
                      src={c.imagen}
                      className="conv-img"
                      alt="Convocatoria"
                    />
                  )}

                  <h3
                    onClick={() =>
                      navigate(`/convocatoria/${c.id_convocatoria}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {c.titulo}
                  </h3>

                  <p className="conv-desc">{c.descripcion}</p>

                  <div className="conv-info">
                    <span>
                      Ubicación: {nombreRegion(c.region)} -{" "}
                      {nombreComuna(c.comuna)}
                    </span>
                    <span>Cupos: {c.capacidad}</span>
                    <span>
                      Fecha: {c.fecha_inicio} → {c.fecha_fin}
                    </span>
                    <span className={`estado-badge estado-${c.estado}`}>
                      {c.estado}
                    </span>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn-view"
                      onClick={() =>
                        navigate(
                          `/organizacion/convocatoria/${c.id_convocatoria}`
                        )
                      }
                    >
                      Ver
                    </button>

                    <button
                      className="btn-edit"
                      disabled={c.estado === "cerrada"}
                      onClick={() =>
                        c.estado !== "cerrada" &&
                        navigate(
                          `/organizacion/editar-convocatoria/${c.id_convocatoria}`
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => eliminarConvocatoria(c.id_convocatoria)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
