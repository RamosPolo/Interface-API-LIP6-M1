import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 1. Créer le contexte
const AuthContext = createContext(null);

// Valeurs spéciales pour le bypass (doivent correspondre à Login.jsx)
const DEV_BYPASS_USER = "dev_bypass_user";
const DEV_BYPASS_PASSWORD = "dev_bypass_password";

// 2. Créer le fournisseur (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Informations sur l'utilisateur connecté
    const [isAuthenticated, setIsAuthenticated] = useState(false); // L'utilisateur est-il authentifié ?
    const [isLoading, setIsLoading] = useState(true); // Chargement initial (vérification localStorage)

    // Effet pour vérifier l'état d'authentification au chargement initial
    useEffect(() => {
        console.log("AuthContext: Checking initial auth state...");
        setIsLoading(true);
        try {
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Dans une vraie appli, vous pourriez vouloir re-valider le token ici
                console.log("AuthContext: Found user in localStorage", parsedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } else {
                 console.log("AuthContext: No user found in localStorage.");
            }
        } catch (error) {
            console.error("AuthContext: Error reading localStorage", error);
            // Assurer un état propre en cas d'erreur
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('authUser');
        } finally {
            setIsLoading(false); // Fin du chargement initial
             console.log("AuthContext: Initial auth check complete.");
        }
    }, []); // Le tableau vide assure que cela ne s'exécute qu'au montage

    // Fonction de connexion
    const login = useCallback(async (email, password) => {
        console.log(`AuthContext: Attempting login for ${email}`);
        setIsLoading(true);

        try {
            // --- Logique de Bypass pour Développement ---
            if (email === DEV_BYPASS_USER && password === DEV_BYPASS_PASSWORD) {
                console.warn("AuthContext: !!! DEVELOPMENT BYPASS ACTIVATED !!!");
                const bypassUser = { id: 'dev-001', email: DEV_BYPASS_USER, name: 'Dev Bypass User' };
                setUser(bypassUser);
                setIsAuthenticated(true);
                localStorage.setItem('authUser', JSON.stringify(bypassUser)); // Persistance simple
                console.log("AuthContext: Dev Bypass Successful", bypassUser);
                setIsLoading(false);
                return; // Important: Sortir après le bypass réussi
            }
            // --- Fin de la Logique de Bypass ---

            // --- Logique de Connexion Normale (SIMULÉE) ---
            // REMPLACER CECI PAR VOTRE VRAI APPEL API BACKEND
            console.log("AuthContext: Simulating API call for login...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simule une latence réseau

            // Simuler une réponse réussie ou échouée du backend
            if (email === "user@example.com" && password === "password123") {
                 // Réponse réussie (simulée)
                const loggedInUser = { id: 'usr-123', email: email, name: 'Utilisateur Exemple' };
                console.log("AuthContext: Simulated API Login Successful", loggedInUser);
                setUser(loggedInUser);
                setIsAuthenticated(true);
                localStorage.setItem('authUser', JSON.stringify(loggedInUser)); // Persistance simple
            } else {
                // Réponse échouée (simulée)
                console.warn("AuthContext: Simulated API Login Failed - Invalid credentials");
                throw new Error("Identifiants invalides (simulation)");
            }
            // --- Fin de la Logique de Connexion Normale (SIMULÉE) ---

        } catch (error) {
            console.error("AuthContext: Login failed", error);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('authUser');
            // Propager l'erreur pour que le composant Login puisse la gérer si besoin
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback pour la stabilité de la référence

    // Fonction de déconnexion
    const logout = useCallback(() => {
        console.log("AuthContext: Logging out");
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authUser'); // Nettoyer la persistance
    }, []); // useCallback pour la stabilité de la référence

    // Valeur fournie par le contexte
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Ne rend les enfants que lorsque le chargement initial est terminé */}
            {!isLoading && children}
            {/* Optionnel: Afficher un indicateur de chargement global pendant l'init */}
            {/* {isLoading && <div>Loading authentication...</div>} */}
        </AuthContext.Provider>
    );
};

// 3. Créer le hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined || context === null) {
        // Ceci arrive si useAuth est utilisé hors d'un AuthProvider
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};