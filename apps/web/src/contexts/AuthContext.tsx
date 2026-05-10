import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getMeRequest, logoutRequest } from "@/api/auth";

type UserRole = "buyer" | "seller" | "admin";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateAuthUser: (updatedUser: AuthUser) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
  });

  function login(newUser: AuthUser) {
    setUser(newUser);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  function updateAuthUser(updatedUser: AuthUser) {
    setUser(updatedUser);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateAuthUser,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return ctx;
}
