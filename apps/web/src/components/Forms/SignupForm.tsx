import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../Forms/Signup.module.css";
import SignupCard from "../UI/SignupCard";

type Role = "buyer" | "seller";

export default function SignupForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role | "">("");
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors("");

        if (!role) {
            setErrors("Please select a role.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    username,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            navigate("/login");
        } catch (err) {
            if (err instanceof Error) {
                setErrors(err.message);
            } else {
                setErrors("Something went wrong.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
                <h1 className={styles.header}>ShopFlow</h1>
            </div>

            <SignupCard className={styles.signupCard}>
                <h2 className={styles.formTitle}>Create your account</h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="username" className={styles.label}>
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Nickname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="role" className={styles.label}>
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                            className={styles.select}
                            required
                        >
                            <option value="" disabled>
                                Select a role
                            </option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                    </div>

                    {errors && <p className={styles.error}>{errors}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? "Creating..." : "Create Account"}
                    </button>
                </form>
            </SignupCard>

            <div className={styles.footerBox}>
                <p className={styles.helperText}>Already have an account?</p>
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => navigate("/login")}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
}