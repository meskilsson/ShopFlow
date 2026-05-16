import { Outlet, Navigate } from "react-router"
import { useAuth } from "@/contexts/AuthContext"


export default function AdminLayout() {

    const { user, isLoading } = useAuth();
    const isAdmin = user?.role === "admin";

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return (

        <main><Outlet /></main>

    )
}