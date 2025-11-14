import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Home.css";

const Home = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [filtroInteres, setFiltroInteres] = useState("");
  const [filtroRegion, setFiltroRegion] = useState("");
  const [filtroComuna, setFiltroComuna] = useState("");
  const [regionId, setRegionId] = useState("");

  // === 1. Intereses ===
  const cargarIntereses = async () => {
    const res = await api.get("/etiquetas/intereses");
    setIntereses(res.data);
  };

  // === 2. Regiones ===
  const cargarRegiones = async () => {
    const res = await api.get("/regiones");
    setRegiones(res.data);
  };

  // === 3. Comunas ===
  const cargarComunas = async (id_region) => {
    if (!id_region) return setComunas([]);
    const res = await api.get(`/comunas/${id_region}`);
    setComunas(res.data);
  };

  // === 4. Convocatorias ===
  useEffect(() => {
    const cargar = async () => {
      const res = await api.get("/convocatorias", {
        params: {
          interes: filtroInteres || undefined,
          region: filtroRegion || undefined,
          comuna: filtroComuna || undefined,
        },
      });
      setConvocatorias(res.data);
    };

    cargar();
  }, [filtroInteres, filtroRegion, filtroComuna]);

  useEffect(() => {
    cargarIntereses();
    cargarRegiones();
  }, []);

  useEffect(() => {
    cargarComunas(regionId);
  }, [regionId]);

  return (
    <div className="home-wrapper">

      {/* ============= HERO SECTION ============= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Conecta. Ayuda. Transforma.</h1>
          <p>Encuentra oportunidades de voluntariado cerca de ti.</p>
          <a href="/register" className="cta-btn">Únete como voluntario</a>
        </div>
      </section>

      {/* ============= FILTROS ============= */}
      <section className="filtros">
        <h2>Filtrar convocatorias</h2>

        <div className="filtro-grid">

          {/* Intereses */}
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

          {/* Región */}
          <select
            value={regionId}
            onChange={(e) => {
              const id = e.target.value;
              setRegionId(id);
              const regionObj = regiones.find(r => String(r.id_region) === String(id));
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

          {/* Comuna */}
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
      </section>

      {/* ============= LISTA DE CONVOCATORIAS ============= */}
      <section className="convocatorias-section">
        <h2>Convocatorias disponibles</h2>

        <div className="convocatorias-grid">

          {convocatorias.length === 0 && (
            <p className="no-results">No hay convocatorias disponibles.</p>
          )}

          {convocatorias.map((c) => (
            <div className="card" key={c.id_convocatoria}>
              <img
                src={c.imagen || "https://via.placeholder.com/400x200?text=Voluntariado"}
                alt="Imagen convocatoria"
              />
              <div className="card-body">
                <h3>{c.titulo}</h3>
                <p className="descripcion">{c.descripcion}</p>

                <p><strong>Región:</strong> {c.region}</p>
                <p><strong>Comuna:</strong> {c.comuna}</p>
                <p><strong>Organización:</strong> {c.nombre_organizacion}</p>

                <a href={`/convocatoria/${c.id_convocatoria}`} className="card-btn">
                  Ver detalles
                </a>
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default Home;
