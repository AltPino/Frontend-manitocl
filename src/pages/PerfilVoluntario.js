import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./PerfilVoluntario.css";
import { useNavigate } from "react-router-dom";
import MisPostulacionesVoluntario from "./MisPostulacionesVoluntario";

export default function PerfilVoluntario() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);

  const fileInputRef = useRef(null);

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [medallas, setMedallas] = useState([]);

  const [form, setForm] = useState({
    nombre_completo: "",
    rut: "",
    fecha_nacimiento: "",
    genero: "",
    region: "",
    comuna: "",
    foto_perfil_voluntario: "",
    nivel: 1,
    puntos: 0,
  });

  // ============================================================
  // Cargar regiones
  // ============================================================
  const cargarRegiones = async () => {
    try {
      const res = await api.get("/regiones");
      setRegiones(res.data);
    } catch (err) {
      console.error("Error cargando regiones:", err);
    }
  };

  // ============================================================
  // Cargar comunas de la región
  // ============================================================
  const cargarComunas = async (idRegion) => {
    if (!idRegion) return;
    try {
      const res = await api.get(`/comunas/${idRegion}`);
      setComunas(res.data);
    } catch (err) {
      console.error("Error cargando comunas:", err);
    }
  };

  // ============================================================
  // Cargar perfil del voluntario
  // ============================================================
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPerfil = async () => {
      try {
        const res = await api.get(`/perfil/voluntario/${usuario.id}`);
        setPerfil(res.data);
        setForm(res.data);

        // 2️⃣ Cargar medallas del voluntario
        const resMed = await api.get(`/medallas/voluntario/${usuario.id}`);
        setMedallas(resMed.data);

        await cargarRegiones();
        await cargarComunas(res.data.region);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [usuario]);

  // ============================================================
  // Subir foto del voluntario
  // ============================================================
  const subirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("foto", archivo);

    try {
      const res = await api.post(
        `/perfil/voluntario/subir-foto/${usuario.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fotoUrl = res.data.fotoUrl;

      setPerfil((prev) => ({
        ...prev,
        foto_perfil_voluntario: fotoUrl,
      }));

      setForm((prev) => ({
        ...prev,
        foto_perfil_voluntario: fotoUrl,
      }));

      alert("Foto actualizada correctamente");
    } catch (error) {
      console.error("Error subiendo foto:", error);
      alert("No se pudo subir la foto");
    }
  };

  // ============================================================
  // Controlar cambios en los inputs
  // ============================================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "region") {
      cargarComunas(e.target.value);
      setForm({ ...form, region: e.target.value, comuna: "" });
    }
  };

  // ============================================================
  // Guardar cambios del perfil
  // ============================================================
  const guardarCambios = async () => {
    try {
      await api.put(`/perfil/voluntario/${usuario.id}`, form);
      setPerfil(form);
      setEditando(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      alert("Error al guardar perfil");
    }
  };

  if (cargando) return <p style={{ padding: 20 }}>Cargando perfil...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil</p>;

  return (
    <div className="vol-prof-wrapper">
      {/* =================== BLOQUE SUPERIOR ===================== */}
      <div className="vol-prof-top">
        {/* ============ AVATAR + BOTONES ============ */}
        <div className="vol-prof-avatar-box">
          <div className="vol-prof-avatar">
            {form.foto_perfil_voluntario ? (
              <img src={form.foto_perfil_voluntario} alt="Perfil" />
            ) : (
              <span>🧑‍🤝‍🧑</span>
            )}
          </div>

          <button
            className="btn-secondary"
            onClick={() => setEditando((prev) => !prev)}
          >
            {editando ? "Dejar de editar" : "Editar perfil"}
          </button>

          <button
            className="btn-secondary"
            style={{ marginTop: "10px" }}
            onClick={() => fileInputRef.current.click()}
          >
            Cambiar foto
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={subirFoto}
          />
        </div>

        {/* ============ DATOS PRINCIPALES ============ */}
        <div className="vol-prof-main">
          <h1>{form.nombre_completo}</h1>

          <span className="vol-level">
            Nivel {perfil.nivel} · {perfil.puntos} pts
          </span>

          <div className="vol-prof-grid">
            <div>
              <label>RUT</label>
              <input type="text" value={form.rut} disabled />
            </div>

            <div>
              <label>Género</label>
              <input type="text" value={perfil.genero} disabled />
            </div>

            <div>
              <label>Fecha nacimiento</label>
              <input
                type="text"
                value={new Date(perfil.fecha_nacimiento).toLocaleDateString()}
                disabled
              />
            </div>

            <div>
              <label>Región</label>
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                disabled={!editando}
              >
                <option value="">Selecciona región</option>
                {regiones.map((r) => (
                  <option key={r.id_region} value={r.id_region}>
                    {r.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Comuna</label>
              <select
                name="comuna"
                value={form.comuna}
                onChange={handleChange}
                disabled={!editando}
              >
                <option value="">Selecciona comuna</option>
                {comunas.map((c) => (
                  <option key={c.id_comuna} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =================== ACCIONES ===================== */}
      <div className="vol-prof-actions">
        {editando && (
          <>
            <button className="btn-primary" onClick={guardarCambios}>
              Guardar cambios
            </button>
            <button
              className="btn-danger"
              onClick={() => {
                setForm(perfil);
                setEditando(false);
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      <div className="vol-prof-card">
        <h2>Mis Medallas</h2>

        {medallas.length === 0 ? (
          <p>Aún no has obtenido medallas.</p>
        ) : (
          <div className="vol-medallas">
            <div className="medallas-grid">
              {medallas.map((m) => (
                <div key={m.id_medalla} className="medalla-item">
                  <img src={m.icono} className="medalla-icono" alt={m.nombre} />

                  <div className="medalla-tooltip">
                    <h4>{m.nombre}</h4>
                    <p>{m.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =================== POSTULACIONES ===================== */}
      <div className="vol-prof-bottom">
        <div className="vol-prof-card">
          <MisPostulacionesVoluntario />

          {perfil.postulaciones?.length === 0 ? (
            <p>Aún no tienes postulaciones.</p>
          ) : (
            perfil.postulaciones?.map((p) => (
              <div className="pv-post-item" key={p.id_postulacion}>
                <div>
                  <h4>{p.titulo}</h4>
                  <span className={`estado estado-${p.estado}`}>
                    {p.estado}
                  </span>
                </div>
                <button
                  className="pv-btn-ver"
                  onClick={() => navigate(`/convocatoria/${p.id_convocatoria}`)}
                >
                  Ver
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
