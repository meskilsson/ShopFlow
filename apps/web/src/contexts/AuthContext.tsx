import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getMeRequest, logoutRequest } from "@/api/auth";
import { getWishlist } from "@/api/wishlist"; // ← NY

type UserRole = "buyer" | "seller" | "admin";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  storeName?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wishlistCount: number;
  refreshWishlist: () => Promise<void>;
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
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);

        const wishlist = await getWishlist();
        setWishlistCount(wishlist.length);
      } catch {
        setUser(null);
        setWishlistCount(0);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const refreshWishlist = async () => {
    if (!user) return;
    try {
      const wishlist = await getWishlist();
      setWishlistCount(wishlist.length);
    } catch {
      setWishlistCount(0);
    }
  };

  function login(newUser: AuthUser) {
    setUser(newUser);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    setWishlistCount(0);
  }

  function updateAuthUser(updatedUser: AuthUser) {
    setUser(updatedUser);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      wishlistCount,
      refreshWishlist,
      login,
      logout,
      updateAuthUser,
    }),
    [user, isLoading, wishlistCount],
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
