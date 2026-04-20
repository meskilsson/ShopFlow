import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";


export default function LoginForm() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            login(data.token, data.user);
            navigate("/");
        } catch (error) {
            if (error instanceof Error) {
                setErrors(error.message)
            } else {
                setErrors("Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit" disabled={isLoading}
                >{isLoading ? "Logging in" : "Log in"}</button>

                {errors && <p>{errors}</p>}
            </form>
        </div>
    );
}