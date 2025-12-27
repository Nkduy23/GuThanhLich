import { createContext } from "react";

export interface AuthContextType {
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
