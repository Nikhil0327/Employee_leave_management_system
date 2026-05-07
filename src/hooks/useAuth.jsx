import { createContext, useContext } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useLocalStorage("leave.auth", {
    token: "",
    user: null,
  });

  const login = async (payload) => {
    const data = await authApi.login(payload);
    const user = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    setAuth({ token: data.token, user });
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    const user = {
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };
    setAuth({ token: data.token, user });
    return data;
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider
      value={{ token: auth.token, user: auth.user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
