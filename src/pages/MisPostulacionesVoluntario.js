import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MisPostulacionesVoluntario.css";

export default function MisPostulacionesVoluntario() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get(`/postulaciones/voluntario/${usuario.id}`);
        setPostulaciones(res.data);
      } catch (error) {
        console.error("Error cargando postulaciones:", error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [usuario]);

  const descargarCertificado = async (id_postulacion) => {
    try {
      const res = await api.get(`/certificados/pdf/${id_postulacion}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `certificado_${id_postulacion}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando certificado:", error);
      alert("No se pudo descargar tu certificado.");
    }
  };

  if (cargando) return <p className="mpv-loading">Cargando postulaciones...</p>;

  return (
    <div className="mpv-wrapper">
      <h2 className="mpv-title">Mis Postulaciones</h2>

      {postulaciones.length === 0 ? (
        <p className="mpv-empty">Aún no has realizado postulaciones.</p>
      ) : (
        <table className="mpv-table">
          <thead>
            <tr>
              <th>Convocatoria</th>
              <th>Ubicación</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {postulaciones.map((p) => (
              <tr key={p.id_postulacion}>
                <td>{p.titulo}</td>
                <td>{p.ubicacion}</td>
                <td>
                  {p.fecha_inicio} → <br />
                  {p.fecha_fin}
                </td>

                <td>
                  <span className={`mpv-tag mpv-${p.estado}`}>{p.estado}</span>
                </td>

                <td className="mpv-actions">
                  <button
                    className="mpv-btn-view"
                    onClick={() =>
                      navigate(`/convocatoria/${p.id_convocatoria}`)
                    }
                  >
                    Ver
                  </button>

                  {/* Mostrar botón descargar si estado = finalizado */}
                  {p.estado === "finalizado" && (
                    <button
                      className="mpv-btn-cert"
                      onClick={() => descargarCertificado(p.id_postulacion)}
                    >
                      Certificado
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
