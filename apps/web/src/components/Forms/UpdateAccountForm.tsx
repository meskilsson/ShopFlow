import { useState, useEffect } from "react";
import { updateUserRequest } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";
import type { UpdateUserData } from "@/types/userTypes";
import ButtonStd from "../UI/ButtonStd";

export default function UpdateAccountForm() {
    const { user: authUser, updateAuthUser } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!authUser) return;

        setName(authUser.name ?? "");
        setUsername(authUser.username ?? "");
        setEmail(authUser.email ?? "");
    }, [authUser]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!authUser?._id) return;

        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const userData: UpdateUserData = {
                name,
                username,
                email,
            };

            const updatedUser = await updateUserRequest(authUser._id, userData);

            updateAuthUser(updatedUser);

            setSuccess("Account updated successfully.");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update account.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section>
            <h2>Update account</h2>
            <p>Change your name, username, or email address.</p>

            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                {error && <p>{error}</p>}
                {success && <p>{success}</p>}

                <ButtonStd variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save changes"}
                </ButtonStd>
            </form>
        </section>
    );
}