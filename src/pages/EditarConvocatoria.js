import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "./NuevaConvocatoria.css";

export default function EditarConvocatoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    capacidad: "",
    fecha_inicio: "",
    fecha_fin: "",
    imagen: "",
    region: "",
    comuna: "",
    intereses: [], // <-- CORRECTO
  });

  // ============================
  // Cargar datos iniciales
  // ============================
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    cargarRegiones();
    cargarIntereses();
    cargarConvocatoria();
  }, []);

  const cargarRegiones = async () => {
    const res = await api.get("/regiones");
    setRegiones(res.data);
  };

  const cargarIntereses = async () => {
    const res = await api.get("/etiquetas/intereses");
    setIntereses(res.data);
  };

  const cargarConvocatoria = async () => {
    try {
      const res = await api.get(`/convocatorias/${id}`);
      const c = res.data;

      setForm({
        titulo: c.titulo,
        descripcion: c.descripcion,
        capacidad: c.capacidad,
        fecha_inicio: c.fecha_inicio?.substring(0, 10),
        fecha_fin: c.fecha_fin?.substring(0, 10),
        imagen: c.imagen,
        region: c.region, // <-- NO TOCAMOS NADA
        comuna: c.comuna, // <-- NO TOCAMOS NADA
        intereses: c.intereses?.map((i) => i.id_etiqueta) || [],
      });

      cargarComunas(c.region);
    } catch (error) {
      console.error("Error al cargar convocatoria:", error);
    }
  };

  const cargarComunas = async (idRegion) => {
    if (!idRegion) return;
    const res = await api.get(`/comunas/${idRegion}`);
    setComunas(res.data);
  };

  const actualizar = (name, value) => {
    setForm({ ...form, [name]: value });

    if (name === "region") {
      cargarComunas(value);
      setForm((prev) => ({ ...prev, region: value, comuna: "" }));
    }
  };

  // ============================
  // Guardar cambios
  // ============================
  const guardarCambios = async () => {
    try {
      await api.put(
        `/convocatorias/${id}`,
        {
          ...form,
          id_organizacion: usuario?.id,
          intereses: form.intereses, // <-- ESTE ERA EL ERROR
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Convocatoria actualizada correctamente");
      navigate("/organizacion/convocatorias");
    } catch (error) {
      console.error("Error actualización:", error);
      alert("Error al actualizar convocatoria");
    }
  };

  return (
    <div className="convocatoria-wrapper">
      <h2>Editar Convocatoria</h2>

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
            value={form.capacidad}
            onChange={(e) => actualizar("capacidad", e.target.value)}
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

      <div className="form-group">
        <label>Comuna</label>
        <select
          value={form.comuna}
          onChange={(e) => actualizar("comuna", e.target.value)}
        >
          <option value="">Selecciona comuna</option>
          {comunas.map((c) => (
            <option key={c.id_comuna} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="etiquetas-titulo">Etiquetas de Interés:</label>

        <div className="etiquetas-container">
          {intereses.map((i) => (
            <button
              key={i.id_etiqueta}
              className={
                form.intereses.includes(i.id_etiqueta) ? "tag active" : "tag"
              }
              onClick={() => {
                const nueva = form.intereses.includes(i.id_etiqueta)
                  ? form.intereses.filter((x) => x !== i.id_etiqueta)
                  : [...form.intereses, i.id_etiqueta];

                actualizar("intereses", nueva); // <-- CORREGIDO
              }}
              type="button"
            >
              {i.nombre}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-submit" onClick={guardarCambios}>
        Guardar Cambios
      </button>
    </div>
  );
}
