import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Connexion</h2>
                <input
                    type="text"
                    placeholder="Identifiant"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full p-2 mb-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full p-2 mb-4 border rounded"
                />
                <Button type="submit" className="w-full">Se connecter</Button>
            </form>
        </div>
    );
};

export default Login;
