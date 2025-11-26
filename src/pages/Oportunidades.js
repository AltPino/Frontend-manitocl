import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Oportunidades.css";
import { useNavigate } from "react-router-dom";

export default function Oportunidades() {
  const [convocatorias, setConvocatorias] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroInteres, setFiltroInteres] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroComuna, setFiltroComuna] = useState("");
  const [regionId, setRegionId] = useState("");

  const navigate = useNavigate();

  // ===== Cargar filtros =====
  useEffect(() => {
    api.get("/etiquetas/intereses").then((res) => setIntereses(res.data));
    api.get("/regiones").then((res) => setRegiones(res.data));
  }, []);

  useEffect(() => {
    if (!regionId) return setComunas([]);
    api.get(`/comunas/${regionId}`).then((res) => setComunas(res.data));
  }, [regionId]);

  // ===== Cargar convocatorias =====
  const [todasConvocatorias, setTodasConvocatorias] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get("/convocatorias", {
        params: {
          interes: filtroInteres || undefined,
          region: filtroRegion || undefined,
          comuna: filtroComuna || undefined,
        },
      });

      setTodasConvocatorias(res.data);
    };

    cargar();
  }, [filtroInteres, filtroRegion, filtroComuna]);

  // 🔥 FILTRO POR TEXTO (BUSCADOR EN FRONTEND)
  useEffect(() => {
    const filtradas = todasConvocatorias.filter(
      (c) =>
        c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nombre_organizacion.toLowerCase().includes(busqueda.toLowerCase())
    );

    setConvocatorias(filtradas);
  }, [busqueda, todasConvocatorias]);

  return (
    <div className="op-wrapper">
      <h1 className="op-title">Oportunidades de Voluntariado</h1>

      {/* ================= BUSCADOR ================= */}
      <div className="op-buscador">
        <input
          type="text"
          placeholder="Buscar por título, organización..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* ================= FILTROS ================= */}
      <div className="op-filtros">
        <select
          value={filtroInteres}
          onChange={(e) => setFiltroInteres(e.target.value)}
        >
          <option value="">Interés</option>
          {intereses.map((i) => (
            <option key={i.id_etiqueta} value={i.nombre}>
              {i.nombre}
            </option>
          ))}
        </select>

        <select
          value={regionId}
          onChange={(e) => {
            const id = e.target.value;
            setRegionId(id);
            const regionObj = regiones.find(
              (r) => String(r.id_region) === String(id)
            );
            setFiltroRegion(regionObj ? regionObj.nombre : "");
            setFiltroComuna("");
          }}
        >
          <option value="">Región</option>
          {regiones.map((r) => (
            <option key={r.id_region} value={r.id_region}>
              {r.nombre}
            </option>
          ))}
        </select>

        <select
          value={filtroComuna}
          onChange={(e) => setFiltroComuna(e.target.value)}
          disabled={!regionId}
        >
          <option value="">Comuna</option>
          {comunas.map((c) => (
            <option key={c.id_comuna} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* ================= CONVOCATORIAS ================= */}
      <div className="op-grid">
        {convocatorias.length === 0 && (
          <p className="op-vacio">No hay oportunidades disponibles.</p>
        )}

        {convocatorias.map((c) => (
          <div
            key={c.id_convocatoria}
            className="op-card"
            onClick={() => navigate(`/convocatoria/${c.id_convocatoria}`)}
          >
            <img
              src={
                c.imagen ||
                "https://via.placeholder.com/400x220?text=Voluntariado"
              }
              alt="Convocatoria"
            />

            <div className="op-card-body">
              <h3>{c.titulo}</h3>
              <p>{c.descripcion}</p>

              <span>
                <strong>Región:</strong> {c.region}
              </span>
              <span>
                <strong>Comuna:</strong> {c.comuna}
              </span>
              <span>
                <strong>Organización:</strong> {c.nombre_organizacion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
