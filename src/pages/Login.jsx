import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, Bot, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const { login, error } = useAuth();

    // Décommenter cette ligne pour activer la connexion automatique avec admin/admin
    // useEffect(() => {
    //     setEmail("admin");
    //     setPassword("admin");
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        
        setIsLoading(true);
        await login(email, password);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                    <motion.div
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                            repeat: Infinity, 
                            duration: 5,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                    >
                        <Bot className="h-12 w-12 text-white" />
                    </motion.div>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mt-6 mb-2">
                        RAG Assistant
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Connectez-vous pour accéder à l'assistant
                    </p>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 flex items-center"
                            >
                                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div 
                            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Identifiant
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Entrez votre identifiant"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Entrez votre mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <Button 
                            type="submit" 
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Se connecter
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            © 2025 RAG Assistant. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;