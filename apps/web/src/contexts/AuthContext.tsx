import {
    useContext,
    createContext,
    useState,
    useEffect,
    useMemo,
    type ReactNode,
} from "react";

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
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    updateAuthUser: (updatedUser: AuthUser) => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_STORAGE_KEY = "auth_token";
const USER_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as AuthUser);
            } catch {
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }

        setIsLoading(false);
    }, []);

    function login(newToken: string, newUser: AuthUser) {
        setToken(newToken);
        setUser(newUser);

        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    }

    function logout() {
        setToken(null);
        setUser(null);

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    function updateAuthUser(updatedUser: AuthUser) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token && user),
            isLoading,
            login,
            logout,
            updateAuthUser,
        }),
        [user, token, isLoading],
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