import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import "./NuevaConvocatoria.css";
import { AuthContext } from "../context/AuthContext";

export default function NuevaConvocatoria() {
  const { usuario } = useContext(AuthContext);

  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    cupos: "",
    fecha_inicio: "",
    fecha_fin: "",
    imagen: "",
    region: "",
    comuna: "",
    etiquetas: [],
  });

  // =======================
  // Cargar listas iniciales
  // =======================
  useEffect(() => {
    api.get("/etiquetas/intereses").then((r) => setIntereses(r.data));
    api.get("/regiones").then((r) => setRegiones(r.data));
  }, []);

  useEffect(() => {
    if (!form.region) return;
    api.get(`/comunas/${form.region}`).then((r) => setComunas(r.data));
  }, [form.region]);

  const actualizar = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // =======================
  // ENVIAR CONVOCATORIA
  // =======================
  const enviar = async () => {
    // ← Convertir REGION ID → NOMBRE
    const regionObj = regiones.find((r) => r.id_region == form.region);
    const regionNombre = regionObj ? regionObj.nombre : "";

    // ← Convertir COMUNA ID → NOMBRE
    const comunaObj = comunas.find((c) => c.id_comuna == form.comuna);
    const comunaNombre = comunaObj ? comunaObj.nombre : "";

    const payload = {
      id_organizacion: usuario?.id || null,
      titulo: form.titulo,
      descripcion: form.descripcion,
      capacidad: form.cupos,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      region: regionNombre, // 👈 AHORA NOMBRE
      comuna: comunaNombre, // 👈 AHORA NOMBRE
      intereses: form.etiquetas,
      imagen: form.imagen || null,
    };

    console.log("ENVIANDO PAYLOAD:", payload);

    try {
      await api.post("/organizacion/convocatorias", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Convocatoria creada correctamente");
      window.location.href = "/organizacion";
    } catch (error) {
      console.error("ERROR CREAR:", error.response?.data || error);
      alert("Error al crear convocatoria");
    }
  };

  return (
    <div className="convocatoria-wrapper">
      <h2>Crear Nueva Convocatoria</h2>

      <div className="form-group">
        <label>Título</label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => actualizar("titulo", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => actualizar("descripcion", e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Cupos</label>
          <input
            type="number"
            value={form.cupos}
            onChange={(e) => actualizar("cupos", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Imagen (URL)</label>
          <input
            type="text"
            value={form.imagen}
            onChange={(e) => actualizar("imagen", e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Fecha Inicio</label>
          <input
            type="date"
            value={form.fecha_inicio}
            onChange={(e) => actualizar("fecha_inicio", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha Fin</label>
          <input
            type="date"
            value={form.fecha_fin}
            onChange={(e) => actualizar("fecha_fin", e.target.value)}
          />
        </div>
      </div>

      {/* REGIONES */}
      <div className="form-group">
        <label>Región</label>
        <select
          value={form.region}
          onChange={(e) => actualizar("region", e.target.value)}
        >
          <option value="">Selecciona región</option>
          {regiones.map((r) => (
            <option key={r.id_region} value={r.id_region}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* COMUNAS */}
      <div className="form-group">
        <label>Comuna</label>
        <select
          value={form.comuna}
          onChange={(e) => actualizar("comuna", e.target.value)}
          disabled={!form.region}
        >
          <option value="">Selecciona comuna</option>
          {comunas.map((c) => (
            <option key={c.id_comuna} value={c.id_comuna}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ETIQUETAS */}
      <div className="form-group etiquetas-container">
        <h3 className="etiquetas-title">Etiquetas de Interés:</h3>

        <div className="etiquetas-grid">
          {intereses.map((i) => {
            const isSelected = form.etiquetas.includes(i.id_etiqueta);

            return (
              <button
                type="button"
                key={i.id_etiqueta}
                className={`etiqueta-tag ${isSelected ? "selected" : ""}`}
                onClick={() =>
                  actualizar(
                    "etiquetas",
                    isSelected
                      ? form.etiquetas.filter((x) => x !== i.id_etiqueta)
                      : [...form.etiquetas, i.id_etiqueta]
                  )
                }
              >
                {i.nombre}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btn-submit" onClick={enviar}>
        Crear Convocatoria
      </button>
    </div>
  );
}
