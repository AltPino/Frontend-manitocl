import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./PostulacionesOrganizacion.css";

export default function PostulacionesOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  // ======================
  // 1. Cargar convocatorias de la ONG
  // ======================
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarConvocatorias = async () => {
      try {
        const res = await api.get(`/organizacion/convocatorias/${usuario.id}`);
        setConvocatorias(res.data);
      } catch (error) {
        console.error("Error cargando convocatorias:", error);
      }
    };

    cargarConvocatorias();
  }, [usuario]);

  // ======================
  // 2. Cargar postulaciones de cada convocatoria
  // ======================
  useEffect(() => {
    const cargarPostulaciones = async () => {
      let lista = [];

      try {
        for (const c of convocatorias) {
          const res = await api.get(
            `/postulaciones/convocatoria/${c.id_convocatoria}`
          );

          res.data.forEach((p) => {
            lista.push({
              ...p,
              tituloConvocatoria: c.titulo,
            });
          });
        }

        setPostulaciones(lista);
      } catch (error) {
        console.error("Error cargando postulaciones:", error);
      }
    };

    if (convocatorias.length > 0) cargarPostulaciones();
  }, [convocatorias]);

  // ======================
  // 3. Filtrar postulaciones
  // ======================
  const postulacionesFiltradas = postulaciones.filter((p) => {
    if (filtro === "todas") return true;
    return p.estado === filtro;
  });

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <h1>Postulaciones Recibidas</h1>

        <select
          className="post-filter"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="aceptada">Aceptadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {postulacionesFiltradas.length === 0 ? (
        <p>No hay postulaciones disponibles.</p>
      ) : (
        <div className="post-grid">
          {postulacionesFiltradas.map((p, i) => (
            <div className="post-card" key={i}>
              <h3>{p.nombre_voluntario}</h3>

              <p>
                <strong>Convocatoria:</strong> {p.tituloConvocatoria}
              </p>

              <p>
                <strong>Fecha de postulación:</strong>{" "}
                {new Date(p.fecha_postulacion).toLocaleString()}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                <span className={`estado estado-${p.estado}`}>{p.estado}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
