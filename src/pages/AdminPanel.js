import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { usuario, logout, cargando } = useContext(AuthContext);

  const navigate = useNavigate();

  const [vista, setVista] = useState("organizaciones");

  const [sesionCerrada, setSesionCerrada] = useState(false);

  // ==================== ORGANIZACIONES ====================
  const [subVistaOrg, setSubVistaOrg] = useState("pendientes");
  const [organizacionesPendientes, setOrganizacionesPendientes] = useState([]);
  const [organizacionesActivas, setOrganizacionesActivas] = useState([]);
  const [organizacionesRechazadas, setOrganizacionesRechazadas] = useState([]);
  const [busquedaOrg, setBusquedaOrg] = useState("");

  // ==================== CONVOCATORIAS ====================
  const [subVistaConv, setSubVistaConv] = useState("pendientes");
  const [convPendientes, setConvPendientes] = useState([]);
  const [convActivas, setConvActivas] = useState([]);
  const [convCerradas, setConvCerradas] = useState([]);
  const [convEliminadas, setConvEliminadas] = useState([]);
  const [busquedaConv, setBusquedaConv] = useState("");

  // ==================== VOLUNTARIOS ====================
  const [busquedaVol, setBusquedaVol] = useState("");
  const [subVistaVol, setSubVistaVol] = useState("activos");
  const [voluntariosActivos, setVoluntariosActivos] = useState([]);
  const [voluntariosPendientes, setVoluntariosPendientes] = useState([]);
  const [voluntariosEliminados, setVoluntariosEliminados] = useState([]);

  // ==================== INTERESES ====================
  const [intereses, setIntereses] = useState([]);
  const [nuevoInteres, setNuevoInteres] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editandoTexto, setEditandoTexto] = useState("");

  // ==================== USE EFFECT ====================
  useEffect(() => {
    if (vista === "organizaciones") {
      cargarOrganizacionesPendientes();
      cargarOrganizacionesActivas();
      cargarOrganizacionesRechazadas();
    }

    if (vista === "convocatorias") {
      cargarConvPendientes();
      cargarConvActivas();
      cargarConvCerradas();
      cargarConvEliminadas();
    }

    if (vista === "voluntarios") {
      cargarVoluntariosActivos();
      cargarVoluntariosPendientes();
      cargarVoluntariosEliminados();
    }

    if (vista === "etiquetas") {
      cargarIntereses();
    }
  }, [vista]);

  // ==================== ORGANIZACIONES ====================
  const cargarOrganizacionesPendientes = async () => {
    const res = await api.get("/admin/organizaciones/pendientes");
    setOrganizacionesPendientes(res.data);
  };

  const cargarOrganizacionesActivas = async () => {
    const res = await api.get("/admin/organizaciones/activas");
    setOrganizacionesActivas(res.data);
  };

  const cargarOrganizacionesRechazadas = async () => {
    const res = await api.get("/admin/organizaciones/rechazadas");
    setOrganizacionesRechazadas(res.data);
  };

  const aprobarOrg = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, { estado: "activo" });
    cargarOrganizacionesPendientes();
    cargarOrganizacionesActivas();
  };

  const rechazarOrg = async (id) => {
    await api.put(`/admin/organizaciones/estado/${id}`, {
      estado: "rechazado",
    });
    cargarOrganizacionesPendientes();
    cargarOrganizacionesRechazadas();
  };

  // ==================== CONVOCATORIAS ====================
  const cargarConvPendientes = async () => {
    const res = await api.get("/admin/convocatorias?estado=pendiente");
    setConvPendientes(res.data);
  };

  const cargarConvActivas = async () => {
    const res = await api.get("/admin/convocatorias?estado=activa");
    setConvActivas(res.data);
  };

  const cargarConvCerradas = async () => {
    const res = await api.get("/admin/convocatorias?estado=cerrada");
    setConvCerradas(res.data);
  };

  const cargarConvEliminadas = async () => {
    const res = await api.get("/admin/convocatorias?estado=eliminada");
    setConvEliminadas(res.data);
  };

  const cambiarEstadoConv = async (id, estado) => {
    await api.put(`/admin/convocatorias/estado/${id}`, { estado });
    cargarConvPendientes();
    cargarConvActivas();
    cargarConvCerradas();
    cargarConvEliminadas();
  };

  // ==================== VOLUNTARIOS ====================
  const cargarVoluntariosActivos = async () => {
    const res = await api.get("/admin/voluntarios?estado=activo");
    setVoluntariosActivos(res.data);
  };

  const cargarVoluntariosPendientes = async () => {
    const res = await api.get("/admin/voluntarios?estado=pendiente");
    setVoluntariosPendientes(res.data);
  };

  const cargarVoluntariosEliminados = async () => {
    const res = await api.get("/admin/voluntarios?estado=eliminado");
    setVoluntariosEliminados(res.data);
  };

  const cambiarEstadoVol = async (id, estado) => {
    await api.put(`/admin/voluntarios/estado/${id}`, { estado });
    cargarVoluntariosActivos();
    cargarVoluntariosPendientes();
    cargarVoluntariosEliminados();
  };

  // ==================== INTERESES ====================
  const cargarIntereses = async () => {
    const res = await api.get("/admin/intereses");
    setIntereses(res.data);
  };

  const crearInteres = async () => {
    if (!nuevoInteres.trim()) return alert("Ingresa un nombre válido");
    await api.post("/admin/intereses", { nombre: nuevoInteres });
    setNuevoInteres("");
    cargarIntereses();
  };

  const activarEdicion = (i) => {
    setEditandoId(i.id_etiqueta);
    setEditandoTexto(i.nombre);
  };

  const guardarEdicion = async () => {
    await api.put(`/admin/intereses/${editandoId}`, { nombre: editandoTexto });
    setEditandoId(null);
    setEditandoTexto("");
    cargarIntereses();
  };

  const eliminarInteres = async (id) => {
    if (!window.confirm("¿Eliminar interés?")) return;
    await api.delete(`/admin/intereses/${id}`);
    cargarIntereses();
  };

  // ==================== FILTROS ====================
  const filtrarVol = (lista) =>
    lista.filter((v) =>
      (v.nombre_completo + " " + v.email)
        .toLowerCase()
        .includes(busquedaVol.toLowerCase())
    );

  const filtrarOrg = (lista) =>
    lista.filter((o) =>
      o.nombre_organizacion?.toLowerCase().includes(busquedaOrg.toLowerCase())
    );

  const filtrarConv = (lista) =>
    lista.filter((c) =>
      c.titulo?.toLowerCase().includes(busquedaConv.toLowerCase())
    );

  const voluntariosActivosFiltrados = filtrarVol(voluntariosActivos);
  const voluntariosPendientesFiltrados = filtrarVol(voluntariosPendientes);
  const voluntariosEliminadosFiltrados = filtrarVol(voluntariosEliminados);

  const orgPendientesFiltradas = filtrarOrg(organizacionesPendientes);
  const orgActivasFiltradas = filtrarOrg(organizacionesActivas);
  const orgRechazadasFiltradas = filtrarOrg(organizacionesRechazadas);

  const convPendientesFiltradas = filtrarConv(convPendientes);
  const convActivasFiltradas = filtrarConv(convActivas);
  const convCerradasFiltradas = filtrarConv(convCerradas);
  const convEliminadasFiltradas = filtrarConv(convEliminadas);

  // ==================== RENDER: SESIÓN ====================
  if (sesionCerrada) {
    setTimeout(() => navigate("/login"), 1500);
    return (
      <div className="logout-screen">
        <h2>Sesión cerrada correctamente</h2>
        <p>Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  // Si aún se está cargando el usuario desde localStorage
  if (cargando) {
    return <p className="admin-loading">Cargando...</p>;
  }

  // Si no hay usuario y ya se terminó de cargar → enviar al login
  if (!usuario) {
    navigate("/login");
    return null;
  }

  // ==================== RENDER UI ====================
  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Admin</h2>
        <p className="sidebar-user">{usuario.nombre}</p>

        <button
          className={vista === "organizaciones" ? "active" : ""}
          onClick={() => setVista("organizaciones")}
        >
          Organizaciones
        </button>

        <button
          className={vista === "convocatorias" ? "active" : ""}
          onClick={() => setVista("convocatorias")}
        >
          Convocatorias
        </button>

        <button
          className={vista === "voluntarios" ? "active" : ""}
          onClick={() => setVista("voluntarios")}
        >
          Voluntarios
        </button>

        <button
          className={vista === "etiquetas" ? "active" : ""}
          onClick={() => setVista("etiquetas")}
        >
          Etiquetas (Intereses)
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            setSesionCerrada(true);
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="contenido">
        <h1>Panel de Administración</h1>

        {/* ======================================================
                    ORGANIZACIONES
        ====================================================== */}
        {vista === "organizaciones" && (
          <section>
            <h2 className="blue-title">
              {subVistaOrg === "pendientes" && "Organizaciones Pendientes"}
              {subVistaOrg === "activas" && "Organizaciones Activas"}
              {subVistaOrg === "rechazadas" && "Organizaciones Rechazadas"}
            </h2>

            {/* BUSCADOR ORGANIZACIONES */}
            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar organización por nombre..."
                value={busquedaOrg}
                onChange={(e) => setBusquedaOrg(e.target.value)}
              />
            </div>

            <div className="subtabs">
              <button
                className={subVistaOrg === "pendientes" ? "active" : ""}
                onClick={() => setSubVistaOrg("pendientes")}
              >
                Pendientes
              </button>

              <button
                className={subVistaOrg === "activas" ? "active" : ""}
                onClick={() => setSubVistaOrg("activas")}
              >
                Activas
              </button>

              <button
                className={subVistaOrg === "rechazadas" ? "active" : ""}
                onClick={() => setSubVistaOrg("rechazadas")}
              >
                Rechazadas
              </button>
            </div>

            <div className="admin-grid">
              {/* Pendientes */}
              {subVistaOrg === "pendientes" &&
                orgPendientesFiltradas.map((o) => (
                  <div className="admin-card" key={o.id_organizacion}>
                    <h3>{o.nombre_organizacion}</h3>
                    <p>
                      <strong>Email:</strong> {o.correo_contacto}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {o.telefono}
                    </p>
                    <div className="admin-card-actions">
                      <button onClick={() => aprobarOrg(o.id_organizacion)}>
                        Aprobar
                      </button>
                      <button
                        className="rechazar"
                        onClick={() => rechazarOrg(o.id_organizacion)}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}

              {/* Activas */}
              {subVistaOrg === "activas" &&
                orgActivasFiltradas.map((o) => (
                  <div className="admin-card" key={o.id_organizacion}>
                    <h3>{o.nombre_organizacion}</h3>
                    <p>
                      <strong>Email:</strong> {o.correo_contacto}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {o.telefono}
                    </p>
                  </div>
                ))}

              {/* Rechazadas */}
              {subVistaOrg === "rechazadas" &&
                orgRechazadasFiltradas.map((o) => (
                  <div className="admin-card" key={o.id_organizacion}>
                    <h3>{o.nombre_organizacion}</h3>
                    <p>
                      <strong>Email:</strong> {o.correo_contacto}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ======================================================
                    CONVOCATORIAS
        ====================================================== */}
        {vista === "convocatorias" && (
          <section>
            <h2 className="blue-title">
              {subVistaConv === "pendientes" && "Convocatorias Pendientes"}
              {subVistaConv === "activas" && "Convocatorias Activas"}
              {subVistaConv === "cerradas" && "Convocatorias Cerradas"}
              {subVistaConv === "eliminadas" && "Convocatorias Eliminadas"}
            </h2>

            {/* BUSCADOR CONVOCATORIAS */}
            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar convocatoria por título..."
                value={busquedaConv}
                onChange={(e) => setBusquedaConv(e.target.value)}
              />
            </div>

            <div className="subtabs">
              <button
                className={subVistaConv === "pendientes" ? "active" : ""}
                onClick={() => setSubVistaConv("pendientes")}
              >
                Pendientes
              </button>
              <button
                className={subVistaConv === "activas" ? "active" : ""}
                onClick={() => setSubVistaConv("activas")}
              >
                Activas
              </button>
              <button
                className={subVistaConv === "cerradas" ? "active" : ""}
                onClick={() => setSubVistaConv("cerradas")}
              >
                Cerradas
              </button>
              <button
                className={subVistaConv === "eliminadas" ? "active" : ""}
                onClick={() => setSubVistaConv("eliminadas")}
              >
                Eliminadas
              </button>
            </div>

            <div className="admin-grid">
              {/* PENDIENTES */}
              {subVistaConv === "pendientes" &&
                convPendientesFiltradas.map((c) => (
                  <div className="admin-card" key={c.id_convocatoria}>
                    <h3
                      onClick={() =>
                        navigate(`/convocatoria/${c.id_convocatoria}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {c.titulo}
                    </h3>

                    <p>
                      <strong>Organización:</strong> {c.nombre_organizacion}
                    </p>
                    <p>
                      <strong>Estado:</strong> {c.estado}
                    </p>
                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "activa")
                        }
                      >
                        Activar
                      </button>
                      <button
                        className="eliminar"
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "eliminada")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

              {/* ACTIVAS */}
              {subVistaConv === "activas" &&
                convActivasFiltradas.map((c) => (
                  <div className="admin-card" key={c.id_convocatoria}>
                    <h3
                      onClick={() =>
                        navigate(`/convocatoria/${c.id_convocatoria}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {c.titulo}
                    </h3>

                    <p>
                      <strong>Organización:</strong> {c.nombre_organizacion}
                    </p>
                    <p>
                      <strong>Estado:</strong> {c.estado}
                    </p>
                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "cerrada")
                        }
                      >
                        Cerrar
                      </button>
                      <button
                        className="eliminar"
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "eliminada")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

              {/* CERRADAS */}
              {subVistaConv === "cerradas" &&
                convCerradasFiltradas.map((c) => (
                  <div className="admin-card" key={c.id_convocatoria}>
                    <h3
                      onClick={() =>
                        navigate(`/convocatoria/${c.id_convocatoria}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {c.titulo}
                    </h3>

                    <p>
                      <strong>Organización:</strong> {c.nombre_organizacion}
                    </p>
                    <p>
                      <strong>Estado:</strong> {c.estado}
                    </p>
                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "activa")
                        }
                      >
                        Reabrir
                      </button>
                      <button
                        className="eliminar"
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "eliminada")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

              {/* ELIMINADAS */}
              {subVistaConv === "eliminadas" &&
                convEliminadasFiltradas.map((c) => (
                  <div className="admin-card" key={c.id_convocatoria}>
                    <h3
                      onClick={() =>
                        navigate(`/convocatoria/${c.id_convocatoria}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {c.titulo}
                    </h3>

                    <p>
                      <strong>Organización:</strong> {c.nombre_organizacion}
                    </p>
                    <p>
                      <strong>Estado:</strong> {c.estado}
                    </p>
                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoConv(c.id_convocatoria, "activa")
                        }
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ======================================================
                    VOLUNTARIOS
        ====================================================== */}
        {vista === "voluntarios" && (
          <section>
            <h2 className="blue-title">Voluntarios</h2>

            {/* BUSCADOR VOLUNTARIOS */}
            <div className="buscador">
              <input
                type="text"
                placeholder="Buscar voluntario por nombre o email..."
                value={busquedaVol}
                onChange={(e) => setBusquedaVol(e.target.value)}
              />
            </div>

            <div className="subtabs">
              <button
                className={subVistaVol === "activos" ? "active" : ""}
                onClick={() => setSubVistaVol("activos")}
              >
                Activos
              </button>

              <button
                className={subVistaVol === "pendientes" ? "active" : ""}
                onClick={() => setSubVistaVol("pendientes")}
              >
                Pendientes
              </button>

              <button
                className={subVistaVol === "eliminados" ? "active" : ""}
                onClick={() => setSubVistaVol("eliminados")}
              >
                Eliminados
              </button>
            </div>

            <div className="admin-grid">
              {/* ACTIVOS */}
              {subVistaVol === "activos" &&
                voluntariosActivosFiltrados.map((v) => (
                  <div className="admin-card" key={v.id_voluntario}>
                    <h3>{v.nombre_completo}</h3>
                    <p>
                      <strong>Email:</strong> {v.email}
                    </p>
                    <p>
                      <strong>RUT:</strong> {v.rut}
                    </p>
                    <p>
                      <strong>Fecha Nacimiento:</strong> {v.fecha_nacimiento}
                    </p>
                    <p>
                      <strong>Género:</strong> {v.genero}
                    </p>
                    <p>
                      <strong>Región:</strong> {v.region}
                    </p>
                    <p>
                      <strong>Comuna:</strong> {v.comuna}
                    </p>
                    <p>
                      <strong>Nivel:</strong> {v.nivel}
                    </p>
                    <p>
                      <strong>Puntos:</strong> {v.puntos}
                    </p>

                    <div className="admin-card-actions">
                      <button
                        className="eliminar"
                        onClick={() =>
                          cambiarEstadoVol(v.id_voluntario, "eliminado")
                        }
                      >
                        Desactivar
                      </button>
                    </div>
                  </div>
                ))}

              {/* PENDIENTES */}
              {subVistaVol === "pendientes" &&
                voluntariosPendientesFiltrados.map((v) => (
                  <div className="admin-card" key={v.id_voluntario}>
                    <h3>{v.nombre_completo}</h3>
                    <p>
                      <strong>Email:</strong> {v.email}
                    </p>

                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoVol(v.id_voluntario, "activo")
                        }
                      >
                        Activar
                      </button>

                      <button
                        className="eliminar"
                        onClick={() =>
                          cambiarEstadoVol(v.id_voluntario, "eliminado")
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

              {/* ELIMINADOS */}
              {subVistaVol === "eliminados" &&
                voluntariosEliminadosFiltrados.map((v) => (
                  <div className="admin-card" key={v.id_voluntario}>
                    <h3>{v.nombre_completo}</h3>
                    <p>
                      <strong>Email:</strong> {v.email}
                    </p>

                    <div className="admin-card-actions">
                      <button
                        onClick={() =>
                          cambiarEstadoVol(v.id_voluntario, "activo")
                        }
                      >
                        Activar nuevamente
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ======================================================
                    INTERESES (CRUD COMPLETO)
        ====================================================== */}
        {vista === "etiquetas" && (
          <section>
            <h2 className="blue-title">Gestión de Intereses</h2>

            <div className="etiquetas-crear">
              <input
                type="text"
                placeholder="Nuevo interés"
                value={nuevoInteres}
                onChange={(e) => setNuevoInteres(e.target.value)}
              />
              <button onClick={crearInteres}>Agregar</button>
            </div>

            <div className="admin-grid">
              {intereses.map((i) => (
                <div className="admin-card" key={i.id_etiqueta}>
                  {editandoId === i.id_etiqueta ? (
                    <>
                      <input
                        value={editandoTexto}
                        onChange={(e) => setEditandoTexto(e.target.value)}
                      />
                      <div className="admin-card-actions">
                        <button onClick={guardarEdicion}>Guardar</button>
                        <button
                          className="rechazar"
                          onClick={() => setEditandoId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{i.nombre}</h3>
                      <div className="admin-card-actions">
                        <button onClick={() => activarEdicion(i)}>
                          Editar
                        </button>
                        <button
                          className="eliminar"
                          onClick={() => eliminarInteres(i.id_etiqueta)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
