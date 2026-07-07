import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [email, setEmail] = useState(() => localStorage.getItem("email"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  function login(authResponse) {
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("email", authResponse.email);
    localStorage.setItem("role", authResponse.role);
    setToken(authResponse.token);
    setEmail(authResponse.email);
    setRole(authResponse.role);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setToken(null);
    setEmail(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
