import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./ConvocatoriasOrganizacion.css";
import { useNavigate } from "react-router-dom";

export default function ConvocatoriasOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const navigate = useNavigate();

  // Cargar regiones
  useEffect(() => {
    api.get("/regiones").then((res) => setRegiones(res.data));
  }, []);

  // Cargar convocatorias de la organización
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

  const nombreRegion = (id) => {
    const region = regiones.find((r) => r.id_region === id);
    return region ? region.nombre : id;
  };

  const eliminarConvocatoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta convocatoria?"))
      return;

    try {
      await api.delete(`/organizacion/convocatorias/${id}`);
      setConvocatorias((prev) => prev.filter((c) => c.id_convocatoria !== id));
    } catch (error) {
      console.error("Error eliminando convocatoria:", error);
    }
  };

  return (
    <div className="conv-org-wrapper">
      <div className="conv-org-header">
        <h1>Todas tus Convocatorias</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/organizacion/nueva-convocatoria")}
        >
          + Nueva Convocatoria
        </button>
      </div>

      {convocatorias.length === 0 ? (
        <p className="no-convocatorias">Aún no tienes convocatorias creadas.</p>
      ) : (
        <div className="conv-org-grid">
          {convocatorias.map((c) => (
            <div className="conv-org-card" key={c.id_convocatoria}>
              {c.imagen && (
                <img src={c.imagen} alt="Imagen" className="conv-img" />
              )}

              <h2 className="conv-title">{c.titulo}</h2>
              <p className="conv-desc">{c.descripcion}</p>

              <div className="conv-info">
                <span>
                  <strong>Ubicación: </strong>
                  {nombreRegion(c.region)} - {c.comuna}
                </span>
                <span>
                  <strong>Cupos: </strong>
                  {c.capacidad}
                </span>
                <span>
                  <strong>Fecha: </strong>
                  {c.fecha_inicio} → {c.fecha_fin}
                </span>
                <span>
                  <strong>Estado: </strong>
                  <span className={`estado estado-${c.estado}`}>
                    {c.estado}
                  </span>
                </span>
              </div>

              <div className="conv-actions">
                {/* BOTÓN VER */}
                <button
                  className="btn-view"
                  onClick={() => navigate(`/convocatoria/${c.id_convocatoria}`)}
                >
                  Ver
                </button>

                {/* BOTÓN EDITAR */}
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

                {/* BOTÓN ELIMINAR */}
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
  );
}
