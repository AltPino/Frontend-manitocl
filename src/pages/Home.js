import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const Home = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [filtroInteres, setFiltroInteres] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");   // nombre de la región
  const [filtroComuna, setFiltroComuna] = useState("");   // nombre de la comuna
  const [regionId, setRegionId] = useState("");           // id para cargar comunas

  // 1. Intereses
  const cargarIntereses = async () => {
    const res = await api.get("/etiquetas/intereses");
    setIntereses(res.data);
  };

  // 2. Regiones
  const cargarRegiones = async () => {
    const res = await api.get("/geo/regiones");
    setRegiones(res.data);
  };

  // 3. Comunas por región (usa id_region)
  const cargarComunas = async (id_region) => {
    if (!id_region) {
      setComunas([]);
      return;
    }
    const res = await api.get(`/geo/comunas/${id_region}`);
    setComunas(res.data);
  };

  // 4. Convocatorias con filtros
  const cargarConvocatorias = async () => {
    const res = await api.get("/convocatorias", {
      params: {
        interes: filtroInteres || undefined,
        region: filtroRegion || undefined,
        comuna: filtroComuna || undefined,
      },
    });
    setConvocatorias(res.data);
  };

  // Cargar inicial
  useEffect(() => {
    cargarIntereses();
    cargarRegiones();
    cargarConvocatorias();
  }, []);

  // Al cambiar regionId -> cargar comunas
  useEffect(() => {
    cargarComunas(regionId);
  }, [regionId]);

  // Al cambiar filtros -> recargar convocatorias
  useEffect(() => {
    cargarConvocatorias();
  }, [filtroInteres, filtroRegion, filtroComuna]);

  // ============= RENDER =============
  return (
    <div className="home-container">
      <h1>Encontremos tu forma de ayudar</h1>

      <div className="filtros-container">

        {/* Interés */}
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

        {/* Región (usa id para comunas, pero también seteamos el nombre para el filtro) */}
        <select
          value={regionId}
          onChange={(e) => {
            const id = e.target.value;
            setRegionId(id);

            const regionObj = regiones.find(
              (r) => String(r.id_region) === String(id)
            );
            setFiltroRegion(regionObj ? regionObj.nombre : "");
            setFiltroComuna(""); // limpiar comuna cuando cambie región
          }}
        >
          <option value="">Región</option>
          {regiones.map((r) => (
            <option key={r.id_region} value={r.id_region}>
              {r.nombre}
            </option>
          ))}
        </select>

        {/* Comuna (solo nombres) */}
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

      {/* LISTA DE CONVOCATORIAS */}
      <div className="convocatorias-list">
        {convocatorias.length === 0 && <p>No hay convocatorias por ahora.</p>}

        {convocatorias.map((c) => (
          <div key={c.id_convocatoria} className="card">
            <h3>{c.titulo}</h3>
            <p>{c.descripcion}</p>
            <p>
              <strong>Ubicación:</strong> {c.region}, {c.comuna}
            </p>
            <p>
              <strong>Organización:</strong> {c.nombre_organizacion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
