import { createContext, useState, useCallback, ReactNode } from "react";
import type { AuthContextType, User } from "./types";
import { login as apiLogin, signup as apiSignup } from "../../services/apiClient";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      setToken(response.token);
      const userData: User = {
        userId: response.userId,
        username: response.username,
        displayName: response.displayName,
      };
      setUser(userData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (userId: string, displayName: string, email: string, password: string, passwordConfirm: string) => {
      setIsLoading(true);
      try {
        const response = await apiSignup(userId, displayName, email, password, passwordConfirm);
        setToken(response.token);
        const userData: User = {
          userId: response.userId,
          username: response.username,
          displayName: response.displayName,
        };
        setUser(userData);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(userData));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
