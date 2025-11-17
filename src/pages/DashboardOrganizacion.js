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

  const nombreRegion = (id) => {
    const region = regiones.find((r) => r.id_region === id);
    return region ? region.nombre : id;
  };

  const nombreComuna = (nombre) => {
    return nombre; // porque ya viene como texto
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

      {/* ======= SECCIÓN PRINCIPAL ======= */}
      <div className="org-section">
        <div className="section-header">
          <h2>Tus Convocatorias</h2>

          <button
            className="btn-primary-org"
            onClick={() => navigate("/organizacion/nueva-convocatoria")}
          >
            + Nueva Convocatoria
          </button>
        </div>

        {/* Lista de convocatorias */}
        {convocatorias.length === 0 ? (
          <p className="no-convocatorias">
            No has creado ninguna convocatoria aún.
          </p>
        ) : (
          <div className="conv-grid">
            {convocatorias.map((c) => (
              <div key={c.id_convocatoria} className="conv-card">
                {c.imagen && (
                  <img src={c.imagen} className="conv-img" alt="Convocatoria" />
                )}

                <h3>{c.titulo}</h3>
                <p className="conv-desc">{c.descripcion}</p>

                <div className="conv-info">
                  <span>
                    Ubicacion: {nombreRegion(c.region)} -{" "}
                    {nombreComuna(c.comuna)}
                  </span>
                  <span> Cupos: {c.capacidad}</span>
                  <span>
                    Fecha de Inicio/Fin: {c.fecha_inicio} → {c.fecha_fin}
                  </span>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-edit"
                    onClick={() =>
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
