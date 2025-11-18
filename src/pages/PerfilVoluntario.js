import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./PerfilVoluntario.css";
import { useNavigate } from "react-router-dom";

export default function PerfilVoluntario() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Para abrir input file
  const fileInputRef = useRef(null);

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

  // ===============================
  // Cargar perfil
  // ===============================
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPerfil = async () => {
      try {
        const res = await api.get(`/perfil/voluntario/${usuario.id}`);
        setPerfil(res.data);
        setForm(res.data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [usuario]);

  // ===============================
  // Subir foto a Cloudinary
  // ===============================
  const subirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const fd = new FormData();
    fd.append("file", archivo);
    fd.append("upload_preset", "manitocl");

    try {
      const r = await fetch(
        "https://api.cloudinary.com/v1_1/manitocl/image/upload",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await r.json();

      if (!data.secure_url) {
        alert("Error subiendo la imagen");
        return;
      }

      // Guardar foto en la BD
      await api.put(`/perfil/voluntario/${usuario.id}`, {
        foto_perfil_voluntario: data.secure_url,
      });

      // Actualizar en pantalla
      setPerfil((p) => ({ ...p, foto_perfil_voluntario: data.secure_url }));
      setForm((p) => ({ ...p, foto_perfil_voluntario: data.secure_url }));

      alert("Foto actualizada correctamente");
    } catch (err) {
      console.error("Error subiendo foto:", err);
      alert("No se pudo subir la foto");
    }
  };

  // Cambios en inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      await api.put(`/perfil/voluntario/${usuario.id}`, form);
      setPerfil(form);
      setEditando(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar perfil");
    }
  };

  if (cargando) return <p style={{ padding: 20 }}>Cargando perfil...</p>;
  if (!perfil) return <p>No se pudo cargar el perfil</p>;

  return (
    <div className="vol-prof-wrapper">
      {/* --------- BLOQUE SUPERIOR --------- */}
      <div className="vol-prof-top">
        {/* --------- AVATAR + BOTONES --------- */}
        <div className="vol-prof-avatar-box">
          <div className="vol-prof-avatar">
            {form.foto_perfil_voluntario ? (
              <img src={form.foto_perfil_voluntario} alt="Perfil" />
            ) : (
              <span>🧑‍🤝‍🧑</span>
            )}
          </div>

          {/* Botón editar perfil */}
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setEditando((prev) => !prev)}
          >
            {editando ? "Dejar de editar" : "Editar perfil"}
          </button>

          {/* Botón cambiar foto */}
          <button
            className="btn-secondary"
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{ marginTop: "10px" }}
          >
            Cambiar foto
          </button>

          {/* Input para subir imagen */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={subirFoto}
          />
        </div>

        {/* --------- DATOS PRINCIPALES --------- */}
        <div className="vol-prof-main">
          <h1>{form.nombre_completo}</h1>

          <div className="vol-level-box">
            <span className="vol-level">
              Nivel {perfil.nivel} · {perfil.puntos} pts
            </span>
          </div>

          <div className="vol-prof-grid">
            <div>
              <label>RUT</label>
              <input
                type="text"
                name="rut"
                value={form.rut || ""}
                onChange={handleChange}
                disabled={!editando}
              />
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
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>

            <div>
              <label>Comuna</label>
              <input
                type="text"
                name="comuna"
                value={form.comuna}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --------- ACCIONES --------- */}
      <div className="vol-prof-actions">
        {editando ? (
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
        ) : (
          <></>
        )}
      </div>

      {/* --------- POSTULACIONES --------- */}
      <div className="vol-prof-bottom">
        <div className="vol-prof-card">
          <h3>Mis postulaciones</h3>

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
