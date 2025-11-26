import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // <-- AGREGADO

const Home = () => {
  const { usuario } = useContext(AuthContext); // <-- AGREGADO

  const [convocatorias, setConvocatorias] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const navigate = useNavigate();

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

  // === 5. Comentarios ===
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const res = await api.get("/comentarios/home");
        setComentarios(res.data);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    };

    cargarComentarios();
  }, []);

  useEffect(() => {
    cargarIntereses();
    cargarRegiones();
  }, []);

  useEffect(() => {
    cargarComunas(regionId);
  }, [regionId]);

  // Carrusel automático
  useEffect(() => {
    let index = 0;
    const slides = document.getElementsByClassName("comentario-slide");

    if (slides.length === 0) return;

    const showSlides = () => {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      index++;
      if (index > slides.length) index = 1;

      slides[index - 1].style.display = "block";
    };

    showSlides();
    const interval = setInterval(showSlides, 5000); // cambio cada 5s

    return () => clearInterval(interval);
  }, [comentarios]);

  return (
    <div className="home-wrapper">
      {/* ============= HERO SECTION ============= */}
      <section className="hero">
        <div className="hero-content">
          <h1>Conecta. Ayuda. Transforma.</h1>
          <p>Encuentra oportunidades de voluntariado cerca de ti.</p>

          {/* ⭐ SOLO cambiar esta línea */}
          {!usuario && (
            <a href="/register" className="cta-btn">
              Únete como voluntario
            </a>
          )}
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

          {/* Solo las primeras 6 convocatorias */}
          {convocatorias.slice(0, 6).map((c) => (
            <div className="card" key={c.id_convocatoria}>
              <img
                src={
                  c.imagen ||
                  "https://via.placeholder.com/400x200?text=Voluntariado"
                }
                alt="Imagen convocatoria"
              />
              <div className="card-body">
                <h3
                  onClick={() => navigate(`/convocatoria/${c.id_convocatoria}`)}
                  style={{ cursor: "pointer" }}
                >
                  {c.titulo}
                </h3>

                <p className="descripcion">{c.descripcion}</p>

                <p>
                  <strong>Región:</strong> {c.region}
                </p>
                <p>
                  <strong>Comuna:</strong> {c.comuna}
                </p>
                <p>
                  <strong>Organización:</strong> {c.nombre_organizacion}
                </p>

                <a
                  href={`/convocatoria/${c.id_convocatoria}`}
                  className="card-btn"
                >
                  Ver detalles
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* ============= COMENTARIOS DE ORGANIZACIONES ============= */}
      <section className="comentarios-section">
        <h2>Lo que dicen las organizaciones</h2>
        <p className="comentarios-subtitle">
          ONGs y fundaciones que han trabajado con voluntarios de Manito.cl
        </p>

        <div className="comentarios-carousel">
          {comentarios.length === 0 ? (
            <p className="no-results">Aún no hay comentarios disponibles.</p>
          ) : (
            comentarios.map((c, index) => (
              <div key={c.id_comentario} className="comentario-slide fade">
                <div className="comentario-card">
                  <h3>{c.nombre_organizacion}</h3>

                  {c.rating && (
                    <span className="comentario-rating">
                      {"★".repeat(c.rating)}
                      {"☆".repeat(5 - c.rating)}
                    </span>
                  )}

                  <h4 className="comentario-title">{c.titulo}</h4>
                  <p className="comentario-text">“{c.comentario}”</p>

                  {c.autor && <p className="comentario-autor">— {c.autor}</p>}
                </div>
              </div>
            ))
          )}
        </div>
        {usuario?.tipo === "organizacion" && (
          <button
            className="btn-comentario-org"
            onClick={() => navigate("/organizacion/comentarios")}
          >
            Dejar un comentario
          </button>
        )}
      </section>

      {/* ============= SECCIÓN DE DONACIONES ============= */}
      <h2 className="donaciones-title">¿Quieres apoyar nuestra misión?</h2>
      <section className="donaciones-section">
        <div className="donaciones-card">
          <h2>Apoya a Manito.cl</h2>
          <p>
            Tu aporte nos ayuda a mantener la plataforma, llegar a más
            organizaciones y conectar a más voluntarios con causas que lo
            necesitan.
          </p>
          <a
            href="https://www.paypal.com/donate"
            target="_blank"
            rel="noreferrer"
            className="donar-btn"
          >
            Donar con PayPal
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
