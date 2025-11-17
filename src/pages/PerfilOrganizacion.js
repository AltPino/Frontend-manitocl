import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./PerfilOrganizacion.css";
import { useNavigate } from "react-router-dom";

export default function PerfilOrganizacion() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // 🔥 NECESARIO para poder abrir el selector de archivos
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombre_organizacion: "",
    nombre_representante: "",
    correo_contacto: "",
    telefono: "",
    ubicacion: "",
    sitio_web: "",
    descripcion: "",
  });

  // ============================================
  // SUBIR FOTO
  // ============================================
  const subirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("foto", archivo);

    try {
      const res = await api.post(
        `/organizacion/perfil/subir-foto/${usuario.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setPerfil((prev) => ({
        ...prev,
        foto_perfil_organizacion: res.data.fotoUrl,
      }));

      alert("Foto actualizada correctamente");
    } catch (error) {
      console.error("Error subiendo foto:", error);
      alert("No se pudo subir la foto");
    }
  };

  // ============================================
  // CARGAR PERFIL AL INICIAR
  // ============================================
  useEffect(() => {
    if (!usuario?.id) return;

    const cargarPerfil = async () => {
      try {
        const res = await api.get(`/organizacion/perfil/${usuario.id}`);
        setPerfil(res.data);
        setForm(res.data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      await api.put(`/organizacion/perfil/${usuario.id}`, form);
      setPerfil(form);
      setEditando(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("No se pudo actualizar el perfil");
    }
  };

  if (cargando) return <p style={{ padding: 20 }}>Cargando perfil...</p>;
  if (!perfil)
    return <p style={{ padding: 20 }}>No se pudo cargar el perfil.</p>;

  return (
    <div className="org-prof-wrapper">
      {/* --------- BLOQUE SUPERIOR --------- */}
      <div className="org-prof-top">
        {/* --------- AVATAR + BOTONES --------- */}
        <div className="org-prof-avatar-box">
          <div className="org-prof-avatar">
            {perfil.foto_perfil_organizacion ? (
              <img src={perfil.foto_perfil_organizacion} alt="Perfil" />
            ) : (
              <span>🏢</span>
            )}
          </div>

          {/* Botón original para editar información */}
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setEditando((prev) => !prev)}
          >
            {editando ? "Dejar de editar" : "Editar perfil"}
          </button>

          {/* 🔥 NUEVO botón para cambiar la foto */}
          <button
            className="btn-secondary"
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{ marginTop: "10px" }}
          >
            Cambiar foto
          </button>

          {/* 🔥 INPUT FILE OCULTO */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={subirFoto}
          />
        </div>

        {/* --------- DATOS PRINCIPALES --------- */}
        <div className="org-prof-main">
          <h1>{form.nombre_organizacion || "Nombre de la organización"}</h1>

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion || ""}
            onChange={handleChange}
            disabled={!editando}
          />

          <div className="org-prof-grid">
            <div>
              <label>Representante</label>
              <input
                type="text"
                name="nombre_representante"
                value={form.nombre_representante || ""}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
            <div>
              <label>Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={form.ubicacion || ""}
                onChange={handleChange}
                disabled={!editando}
              />
            </div>
          </div>
        </div>

        {/* --------- CONTACTO --------- */}
        <div className="org-prof-side">
          <h2>Información de contacto</h2>

          <label>Correo de contacto</label>
          <input
            type="email"
            name="correo_contacto"
            value={form.correo_contacto || ""}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
            disabled={!editando}
          />

          <label>Sitio web</label>
          <input
            type="text"
            name="sitio_web"
            value={form.sitio_web || ""}
            onChange={handleChange}
            disabled={!editando}
          />
        </div>
      </div>

      {/* --------- ACCIONES --------- */}
      <div className="org-prof-actions">
        {editando ? (
          <>
            <button
              className="btn-primary"
              type="button"
              onClick={guardarCambios}
            >
              Guardar cambios
            </button>
            <button
              className="btn-danger"
              type="button"
              onClick={() => {
                setForm(perfil);
                setEditando(false);
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate("/organizacion/nueva-convocatoria")}
          >
            Crear nueva convocatoria
          </button>
        )}
      </div>

      {/* --------- BLOQUE INFERIOR --------- */}
      <div className="org-prof-bottom">
        <div className="org-prof-card">
          <h3>Métricas generales</h3>
          <p>Aquí podrás ver estadísticas más adelante.</p>
        </div>

        <div className="org-prof-card">
          <h3>Notas internas</h3>
          <p>Espacio para recordatorios o avisos importantes.</p>
        </div>

        <div className="org-prof-card">
          <h3>Próximas mejoras</h3>
          <p>
            Calendario, estadísticas, logros y más herramientas para tu
            organización.
          </p>
        </div>
      </div>
    </div>
  );
}
