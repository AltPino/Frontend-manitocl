import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import "./ComentariosOrganizacion.css";

export default function ComentariosOrganizacion() {
  const { usuario } = useContext(AuthContext);

  const [form, setForm] = useState({
    titulo: "",
    comentario: "",
    autor: "",
    rating: 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviarComentario = async () => {
    try {
      await api.post("/comentarios", {
        id_organizacion: usuario.id,
        ...form,
      });

      alert("Comentario enviado correctamente");
      setForm({ titulo: "", comentario: "", autor: "", rating: 5 });
    } catch (error) {
      console.error(error);
      alert("Error al enviar comentario");
    }
  };

  return (
    <div className="comentarios-wrapper">
      <h1>Dejar un comentario</h1>

      <input
        type="text"
        name="titulo"
        placeholder="Título del comentario"
        value={form.titulo}
        onChange={handleChange}
      />

      <textarea
        name="comentario"
        placeholder="Escribe tu opinión..."
        value={form.comentario}
        onChange={handleChange}
      />

      <input
        type="text"
        name="autor"
        placeholder="Autor (opcional)"
        value={form.autor}
        onChange={handleChange}
      />

      <select name="rating" value={form.rating} onChange={handleChange}>
        <option value="5">★★★★★ (5)</option>
        <option value="4">★★★★☆ (4)</option>
        <option value="3">★★★☆☆ (3)</option>
        <option value="2">★★☆☆☆ (2)</option>
        <option value="1">★☆☆☆☆ (1)</option>
      </select>

      <button onClick={enviarComentario}>Enviar comentario</button>
    </div>
  );
}
