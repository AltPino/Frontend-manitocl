import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./DashboardOrganizacion.css";

export default function DashboardOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const cargarConvocatorias = async () => {
    try {
      const res = await api.get("/organizacion/convocatorias");
      setConvocatorias(res.data);
    } catch (error) {
      console.error("Error al cargar convocatorias:", error);
    }
  };

  const eliminarConvocatoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta convocatoria?"))
      return;

    try {
      await api.delete(`/organizacion/convocatorias/${id}`);
      cargarConvocatorias();
    } catch (error) {
      console.error("Error al eliminar convocatoria:", error);
    }
  };

  return (
    <div className="org-wrapper">
      {/* ======= HEADER ======= */}
      <div className="org-header">
        <div className="org-avatar">🏢</div>
        <h1 className="org-name">Bienvenido, {usuario?.nombre}</h1>
        <span className="org-badge">Cuenta: Organización</span>
      </div>

      {/* ======= SECCIÓN ======= */}
      <div className="org-section">
        <div className="section-header">
          <h2>Tus Convocatorias</h2>
          <button className="btn-primary-org">+ Nueva Convocatoria</button>
        </div>

        {convocatorias.length === 0 ? (
          <p className="no-convocatorias">
            No has creado ninguna convocatoria aún.
          </p>
        ) : (
          <div className="conv-grid">
            {convocatorias.map((c) => (
              <div className="conv-card" key={c.id_convocatoria}>
                <h3>{c.titulo}</h3>
                <p className="conv-desc">{c.descripcion}</p>

                <div className="card-actions">
                  <button className="btn-edit">Editar</button>
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
