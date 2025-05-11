import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userParameters, setUserParameters] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Vérifier l'authentification au chargement
    useEffect(() => {
        const checkAuth = async () => {
            const storedAuth = localStorage.getItem("isAuthenticated");
            const storedUser = localStorage.getItem("user");
            const storedParams = localStorage.getItem("userParameters");
            
            if (storedAuth && storedUser) {
                setIsAuthenticated(true);
                setUser(JSON.parse(storedUser));
                
                if (storedParams) {
                    setUserParameters(JSON.parse(storedParams));
                }
            }
            
            setIsLoading(false);
        };
        
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setError(null);
        setIsLoading(true);
        
        try {      
            // Requête normale à l'API
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (response.status === 200) {
                const data = await response.json();
                setIsAuthenticated(true);
    
                if (data.user_id) {
                    const userObj = { email, id: data.user_id, role: data.user_role };
                    setUser(userObj);
                    localStorage.setItem("isAuthenticated", "true");
                    localStorage.setItem("user", JSON.stringify(userObj));
    
                    try {
                        const paramsResponse = await fetch(`http://127.0.0.1:5000/parameters/get?user_id=${data.user_id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
    
                        if (paramsResponse.ok) {
                            const userParams = await paramsResponse.json();
                            setUserParameters(userParams.data);
                            localStorage.setItem("userParameters", JSON.stringify(userParams.data));
                        } else {
                            throw new Error("Erreur lors de la récupération des paramètres");
                        }
                    } catch (paramError) {
                        console.error("Erreur lors de la récupération des paramètres:", paramError);
                    }
                } else {
                    setError("Erreur : identifiant utilisateur manquant dans la réponse");
                    console.error("user_id is missing in the response data");
                }
            } else {
                setError("Identifiants incorrects");
                throw new Error("Identifiants incorrects");
            }
        } catch (error) {
            setError("Identifiants incorrects ou problème de connexion");
            console.error("Error during login:", error);
        } finally {
            setIsLoading(false);
        }
    };       

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserParameters(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("userParameters");
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            userParameters, 
            setUserParameters, 
            login, 
            logout,
            isLoading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);