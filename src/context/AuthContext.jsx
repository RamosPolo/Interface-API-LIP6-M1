import { createContext, useState, useContext } from "react";

// contexte pour accéder à cette variable dans l'application
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // sauvegarde l'etat du contexte dans un localStorage
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";

    // état de connexion
    const [isAuthenticated, setIsAuthenticated] = useState(storedAuth);

    const login = (username, password) => {

        // variable pour la connexion
        const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;


        if (username === adminUsername && password === adminPassword) {
            setIsAuthenticated(true);
            // sauvegarde du contexte
            localStorage.setItem("isAuthenticated", "true");
        } else {
            // gérer l'erreur ici
            alert("Identifiants incorrects !");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        // on sauvegarde le contexte
        localStorage.removeItem("isAuthenticated"); // Suppression
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
