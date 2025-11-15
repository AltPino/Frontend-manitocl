import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // Verificar token al iniciar la app
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
        // 🔥 Guardar usuario verificado
        setUsuario(res.data.usuario);

        // 🔥 Guardar también en localStorage por si se refresca la página
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

    // 🔥 Guardar usuario también
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
