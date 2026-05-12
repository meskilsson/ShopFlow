import { changePasswordRequest } from "@/api/user";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ButtonStd from "../UI/ButtonStd";

export default function ChangePasswordForm() {
    const { user: authUser } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!authUser?._id) return;

        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);

        try {
            await changePasswordRequest(authUser._id, {
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setSuccess("Password updated successfully.");
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to update password"
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section>
            <h2>Change password</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="currentPassword">Current password</label>
                <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                />

                <label htmlFor="newPassword">New password</label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    required
                />

                <label htmlFor="confirmPassword">Confirm new password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />

                {error && <p>{error}</p>}
                {success && <p>{success}</p>}

                <ButtonStd variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update password"}
                </ButtonStd>
            </form>
        </section>
    );
}