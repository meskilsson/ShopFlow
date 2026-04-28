import Container from "@/components/containers/Container";
import ButtonStd from "@/components/UI/ButtonStd";


import { useNavigate } from "react-router";
import { getUserByIdRequest } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";

import type { User } from "@/types/userTypes";

import { useState, useEffect } from "react";


export default function ProfilePage() {

    const navigate = useNavigate();

    const { user: authUser } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                if (!authUser?._id) {
                    setError("No logged in user found.");
                    return;
                }

                const userData = await getUserByIdRequest(authUser._id);

                setUser(userData);

            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        getUser();
    }, [authUser?._id]);




    if (isLoading) {
        return <p>Loading profile...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!user) {
        return <p>No user found</p>
    }

    return (
        <Container>
            <h2>Profile</h2>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            <p>Role: {user.role}</p>

        </Container>
    );
}