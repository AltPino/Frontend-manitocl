import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // 1️⃣ Restaurar usuario desde localStorage al iniciar
  // ================================
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      setUsuario(JSON.parse(storedUser)); // 🔥 restaurar usuario inmediatamente
    }
  }, []);

  // ================================
  // 2️⃣ Verificar token con el backend
  // ================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/verify")
      .then((res) => {
        setUsuario(res.data.usuario);

        // actualizar almacenamiento local
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ================================
  // LOGIN
  // ================================
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    setUsuario(data.usuario);
  };

  // ================================
  // LOGOUT
  // ================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
