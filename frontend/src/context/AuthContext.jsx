import { useEffect, useState } from "react";
import api from "../lib/axios";
import { AuthContext, TOKEN_KEY } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    const handleForcedLogout = () => setUser(null);

    window.addEventListener("auth:logout", handleForcedLogout);
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return () => window.removeEventListener("auth:logout", handleForcedLogout);
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  const signIn = ({ token, user: authenticatedUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(authenticatedUser);
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
