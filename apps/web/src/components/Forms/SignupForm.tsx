
import { useState } from "react";

type Role = "buyer" | "seller";


export default function SignupForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<Role | "">("");
    const [errors, setErrors] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, username, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            };
        } catch (err) {
            if (err instanceof Error) {
                setErrors(err.message);
            } else {
                setErrors("Something went wrong")
            }
        } finally {
            setIsLoading(false);
        }

    }


    return (

        //Container
        <div>
            <form
                onSubmit={handleSubmit}
            >
                <label>Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Nickname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "buyer" | "seller")}
                >
                    <option
                        value=""
                        disabled
                    >Select a role</option>
                    <option
                        value="buyer"
                    >Buyer</option>
                    <option
                        value="seller"
                    >Seller</option>
                </select>

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating..." : "Create Account"}
                </button>

                {errors && <p>{errors}</p>}
            </form>
        </div>
        //End of container
    );
}