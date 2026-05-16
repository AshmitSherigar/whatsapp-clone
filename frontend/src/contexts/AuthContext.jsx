import { createContext } from "react";
import { useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const url = "http://localhost:5000/api/auth/login";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.status) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      setUser(result.user);
      setToken(result.token);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    } catch (error) {
      console.error("Error:" + error.message);
    }
  };

  const register = async (username, password) => {
    const url = "http://localhost:5000/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.status) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      setUser(result.user);
      setToken(result.token);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
    } catch (error) {
      console.error("Error:" + error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
