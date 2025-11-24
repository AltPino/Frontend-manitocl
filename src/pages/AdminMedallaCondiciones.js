import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import "./AdminPanel.css"; // reutiliza tu estilo actual

export default function AdminMedallaCondiciones() {
  const { id } = useParams(); // id de la medalla
  const [medalla, setMedalla] = useState(null);
  const [condiciones, setCondiciones] = useState([]);

  const [tipo, setTipo] = useState("postulaciones_totales");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ============================
  // Cargar medalla
  // ============================
  const cargarMedalla = async () => {
    const res = await api.get(`/medallas/voluntario`);
    const datos = res.data.find((m) => m.id_medalla === id);
    setMedalla(datos || null);
  };

  // ============================
  // Cargar condiciones
  // ============================
  const cargarCondiciones = async () => {
    const res = await api.get(`/medallas/condiciones/${id}`);
    setCondiciones(res.data);
  };

  useEffect(() => {
    cargarMedalla();
    cargarCondiciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================
  // Crear nueva condición
  // ============================
  const crearCondicion = async () => {
    if (!valor.trim()) return alert("Debes ingresar un valor numérico");

    await api.post("/medallas/condiciones/crear", {
      id_medalla: id,
      tipo,
      valor_requerido: valor,
      descripcion,
    });

    setValor("");
    setDescripcion("");
    cargarCondiciones();
  };

  // ============================
  // Eliminar condición
  // ============================
  const eliminarCondicion = async (id_condicion) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta condición?")) return;

    await api.delete(`/medallas/condiciones/${id_condicion}`);
    cargarCondiciones();
  };

  return (
    <div className="admin-panel-container">
      <h1 className="blue-title">Condiciones de la Medalla</h1>

      {medalla && (
        <div className="medalla-info-card">
          {medalla.icono && (
            <img
              src={medalla.icono}
              alt={medalla.nombre}
              className="medalla-icono"
            />
          )}
          <h2>{medalla.nombre}</h2>
          <p>{medalla.descripcion}</p>
        </div>
      )}

      {/* FORMULARIO */}
      <div className="condiciones-form">
        <h3>Nueva condición</h3>

        <label>Tipo de condición:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="postulaciones_totales">Postulaciones totales</option>
          <option value="postulaciones_finalizadas">
            Postulaciones finalizadas
          </option>
          <option value="postulaciones_mensuales">
            Postulaciones este mes
          </option>
        </select>

        <label>Valor requerido:</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Ej: 5"
        />

        <label>Descripción opcional:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <button className="btn-primary" onClick={crearCondicion}>
          Guardar condición
        </button>
      </div>

      {/* LISTA DE CONDICIONES */}
      <div className="admin-grid">
        {condiciones.map((c) => (
          <div key={c.id_condicion} className="admin-card">
            <h4>{c.tipo.replaceAll("_", " ")}</h4>
            <p>
              <strong>Valor:</strong> {c.valor_requerido}
            </p>
            <p>{c.descripcion}</p>
            <button
              className="btn-danger"
              onClick={() => eliminarCondicion(c.id_condicion)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
