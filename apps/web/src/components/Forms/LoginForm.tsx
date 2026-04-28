import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import LoginCard from "../UI/LoginCard";
import styles from './Login.module.css';
import { loginRequest } from "@/api/auth";


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

            const data = await loginRequest({
                email,
                password,
            });

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

        //WRAPPER CONTAINER
        <div className={styles.wrapper}>
            <div className={styles.headerContainer}>
                <h1 className={styles.header}>Shopflow</h1>
            </div>
            <LoginCard


            >
                <h2 className={styles.formTitle}>Sign in to your account</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />

                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        placeholder="*******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button
                        type="submit" disabled={isLoading} className={styles.button}
                    >{isLoading ? "Logging in" : "Log in"}</button>

                    {errors && <p>{errors}</p>}
                </form>
            </LoginCard>

            <div className={styles.footerBox}>
                <p className={styles.helperText}>Don't have an account?</p>
                <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => navigate("/signup")}
                >Sign up</button>
            </div>
        </div>

        //WRAPPER CONTAINER
    );
}