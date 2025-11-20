import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "./VerConvocatoria.css";

export default function VerConvocatoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [convocatoria, setConvocatoria] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resConv = await api.get(`/convocatorias/${id}`);
        setConvocatoria(resConv.data);

        const resPost = await api.get(`/postulaciones/convocatoria/${id}`);
        setPostulaciones(resPost.data);
      } catch (error) {
        console.error("Error cargando convocatoria:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  if (cargando) return <p className="vc-loading">Cargando...</p>;
  if (!convocatoria)
    return <p className="vc-error">Convocatoria no encontrada.</p>;

  const cuposUsados = postulaciones.length;
  const cuposDisponibles = convocatoria.capacidad - cuposUsados;

  // 🔥 NO BORRO tu variable, solo la arreglo para que funcione
  const esPropietario =
    (usuario?.tipo === "organizacion" ||
      usuario?.tipo_usuario === "organizacion") &&
    Number(usuario?.id || usuario?.id_usuario) ===
      Number(convocatoria.id_organizacion);

  // 🔥 función para finalizar convocatoria (solo agregada)
  const finalizarConvocatoria = async () => {
    try {
      await api.put(`/convocatorias/finalizar/${convocatoria.id_convocatoria}`);
      alert("Convocatoria finalizada correctamente");
      window.location.reload();
    } catch (error) {
      console.error("Error al finalizar:", error);
      alert("Error al finalizar la convocatoria");
    }
  };

  return (
    <div className="vc-wrapper">
      {/* =====================================================
          FOTO PRINCIPAL / BANNER
      ===================================================== */}
      {convocatoria.imagen && (
        <div className="vc-banner">
          <img
            className="vc-img"
            src={convocatoria.imagen}
            alt="Convocatoria"
          />
        </div>
      )}

      {/* =====================================================
          TÍTULO Y ORGANIZACIÓN
      ===================================================== */}
      <h2 className="vc-org-name">{convocatoria.nombre_organizacion}</h2>

      <h1 className="vc-title">{convocatoria.titulo}</h1>

      {/* =====================================================
          CONTENEDOR PRINCIPAL (DOS COLUMNAS)
      ===================================================== */}
      <div className="vc-content">
        {/* ======= COLUMNA IZQUIERDA: DESCRIPCIÓN ======= */}
        <div className="vc-left">
          <h2>Descripción</h2>
          <p className="vc-description">{convocatoria.descripcion}</p>
        </div>

        <p className="vc-org">
          <strong>Organización:</strong> {convocatoria.nombre_organizacion}
        </p>

        {/* ======= COLUMNA DERECHA: INFO Y CUPOS ======= */}
        <div className="vc-right">
          <div className="vc-info-box">
            <p>
              <strong>Ubicación:</strong> {convocatoria.region} –{" "}
              {convocatoria.comuna}
            </p>
            <p>
              <strong>Inicio:</strong> {convocatoria.fecha_inicio}
            </p>
            <p>
              <strong>Fin:</strong> {convocatoria.fecha_fin}
            </p>
            <p>
              <strong>Cupos totales:</strong> {convocatoria.capacidad}
            </p>
            <p>
              <strong>Cupos ocupados:</strong> {cuposUsados}
            </p>
            <p>
              <strong>Cupos disponibles:</strong> {cuposDisponibles}
            </p>
          </div>

          {/* =====================================================
              ETIQUETAS (AISLADAS)
          ===================================================== */}
          <div className="vc-tags">
            {convocatoria.intereses?.length > 0 ? (
              convocatoria.intereses.map((tag) => (
                <span key={tag.id_etiqueta} className="vc-tag">
                  {tag.nombre}
                </span>
              ))
            ) : (
              <span className="vc-tag-disabled">Sin etiquetas</span>
            )}
          </div>

          {/* ======= ACCIONES (AISLADAS) ======= */}
          <div className="vc-actions">
            <button className="vc-btn-secondary" onClick={() => navigate(-1)}>
              Volver
            </button>

            {/* 🔥 TU BOTÓN EDITAR NO SE TOCA */}
            {esPropietario && convocatoria.estado !== "cerrada" && (
              <button
                className="vc-btn-primary"
                onClick={() =>
                  navigate(
                    `/organizacion/editar-convocatoria/${convocatoria.id_convocatoria}`
                  )
                }
              >
                Editar Convocatoria
              </button>
            )}

            {/* 🔥 NUEVO BOTÓN FINALIZAR — SIN BORRAR NADA */}
            {esPropietario && convocatoria.estado === "activa" && (
              <button className="vc-btn-danger" onClick={finalizarConvocatoria}>
                Finalizar Convocatoria
              </button>
            )}

            {/* 🔥 BOTÓN POSTULAR (NO LO TOCO) */}
            {usuario?.tipo_usuario === "voluntario" && (
              <button
                className="vc-btn-primary"
                onClick={() =>
                  navigate(`/postular/${convocatoria.id_convocatoria}`)
                }
              >
                Postular
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
