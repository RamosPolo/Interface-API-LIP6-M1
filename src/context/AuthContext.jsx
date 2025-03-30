import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userParameters, setUserParameters] = useState(null);

    const login = async (email, password) => {
        try {
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
                    setUser({ email, id: data.user_id, role: data.user_role });
                    localStorage.setItem("isAuthenticated", true);
                    localStorage.setItem("user", JSON.stringify({ email, id: data.user_id, role: data.user_role }));
    
                    const paramsResponse = await fetch(`http://127.0.0.1:5000/parameters/get?user_id=${data.user_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
    
                    if (paramsResponse.ok) {
                        const userParams = await paramsResponse.json();
                        setUserParameters(userParams);
                        localStorage.setItem("userParameters", JSON.stringify(userParams));
                    }
                } else {
                    console.error("user_id is missing in the response data");
                }
            }
        } catch (error) {
            alert("Identifiants incorrects");
            console.error("Error during login:", error);
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
        <AuthContext.Provider value={{ isAuthenticated, user, userParameters, setUserParameters, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);