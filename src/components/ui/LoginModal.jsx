import React from "react";
import { Button } from "@/components/ui/button";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                    <Button type="submit" className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600">
                        Se connecter
                    </Button>
                    <Button type="button" onClick={onClose} className="border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-100">
                        Annuler
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
