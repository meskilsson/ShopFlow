import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getMeRequest, logoutRequest } from "@/api/auth";
import { getWishlist } from "@/api/wishlist";

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

  // Initial load av user + wishlist count
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getMeRequest();
        setUser(currentUser);

        if (currentUser) {
          const wishlist = await getWishlist();
          setWishlistCount(wishlist.length);
        }
      } catch {
        setUser(null);
        setWishlistCount(0);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  function login(newUser: AuthUser) {
    setUser(newUser);

    (async () => {
      try {
        const wishlist = await getWishlist();
        setWishlistCount(wishlist.length);
      } catch {
        setWishlistCount(0);
      }
    })();
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
    setWishlistCount(0);
  }

  function updateAuthUser(updatedUser: AuthUser) {
    setUser(updatedUser);
  }

  const refreshWishlist = async () => {
    try {
      const wishlist = await getWishlist();
      setWishlistCount(wishlist.length);
    } catch {
      setWishlistCount(0);
    }
  };

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
