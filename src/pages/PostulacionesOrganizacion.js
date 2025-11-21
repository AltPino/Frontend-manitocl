import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "./PostulacionesOrganizacion.css";

export default function PostulacionesOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const [convocatorias, setConvocatorias] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState("");

  useEffect(() => {
    if (!usuario?.id) return;

    // Cargar convocatorias de la organización
    api
      .get(`/organizacion/convocatorias/${usuario.id}`)
      .then((res) => setConvocatorias(res.data))
      .catch((err) => console.error(err));
  }, [usuario]);

  // Cargar postulaciones de una convocatoria
  const [convocatoriaInfo, setConvocatoriaInfo] = useState(null);

  const cargarPostulaciones = async (idConv) => {
    setConvocatoriaSeleccionada(idConv);

    if (!idConv) {
      setPostulaciones([]);
      setConvocatoriaInfo(null);
      return;
    }

    // Obtener la convocatoria para conocer su estado
    const resConv = await api.get(`/convocatorias/${idConv}`);
    setConvocatoriaInfo(resConv.data);

    // Obtener postulaciones
    const res = await api.get(`/postulaciones/convocatoria/${idConv}`);
    setPostulaciones(res.data);
  };

  // Aceptar / rechazar postulante
  const cambiarEstado = async (id_postulacion, estadoNuevo) => {
    try {
      await api.put(`/postulaciones/${id_postulacion}`, {
        estado: estadoNuevo,
      });
      await cargarPostulaciones(convocatoriaSeleccionada); // recargar vista
    } catch (error) {
      console.error("Error actualizando estado:", error);
      alert("Error al actualizar estado");
    }
  };

  const generarCertificado = (postulacion) => {
    // Aquí generaremos el PDF simple
    window.open(`/certificado?id=${postulacion.id_postulacion}`, "_blank");
  };

  return (
    <div className="post-wrapper">
      <h1>Postulaciones Recibidas</h1>

      {convocatoriaInfo?.estado === "cerrada" && (
        <p className="post-closed-msg">
          Esta convocatoria está finalizada. No se pueden gestionar
          postulaciones.
        </p>
      )}

      {/* Selector de convocatoria */}
      <select
        value={convocatoriaSeleccionada}
        onChange={(e) => cargarPostulaciones(e.target.value)}
        className="post-select"
      >
        <option value="">Selecciona una convocatoria</option>

        {convocatorias.map((c) => (
          <option key={c.id_convocatoria} value={c.id_convocatoria}>
            {c.titulo}
          </option>
        ))}
      </select>

      {/* Tabla */}
      {convocatoriaSeleccionada && (
        <table className="post-table">
          <thead>
            <tr>
              <th>Voluntario</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
              {postulaciones.estado === "finalizado" && (
                <button
                  className="btn-cert"
                  onClick={() => generarCertificado(postulaciones)}
                >
                  Certificado
                </button>
              )}
            </tr>
          </thead>

          <tbody>
            {postulaciones.length === 0 ? (
              <tr>
                <td colSpan="5" className="post-empty">
                  No hay postulaciones para esta convocatoria.
                </td>
              </tr>
            ) : (
              postulaciones.map((p) => (
                <tr key={p.id_postulacion}>
                  <td>{p.nombre_completo}</td>
                  <td>{p.email}</td>
                  <td>
                    <span className={`estado-tag estado-${p.estado}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>{new Date(p.fecha_postulacion).toLocaleString()}</td>

                  <td className="post-actions">
                    {convocatoriaInfo?.estado !== "cerrada" &&
                      p.estado !== "aceptado" && (
                        <button
                          className="btn-accept"
                          onClick={() =>
                            cambiarEstado(p.id_postulacion, "aceptado")
                          }
                        >
                          Aceptar
                        </button>
                      )}

                    {convocatoriaInfo?.estado !== "cerrada" &&
                      p.estado !== "rechazado" && (
                        <button
                          className="btn-reject"
                          onClick={() =>
                            cambiarEstado(p.id_postulacion, "rechazado")
                          }
                        >
                          Rechazar
                        </button>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
