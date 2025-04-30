import React, { useState, createContext, useContext, useEffect } from "react";
import Home from "@/pages/Home";
import AddDocuments from "@/pages/AddDocuments";
import RagSettings from "@/pages/RagSettings";
import History from "@/pages/History";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    Menu, 
    Home as HomeIcon, 
    Upload, 
    Settings, 
    History as HistoryIcon, 
    LogOut,
    User
} from "lucide-react";
import Login from "@/pages/Login.jsx";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

export const ChatContext = createContext();
export const DocumentContext = createContext();
export const RagContext = createContext();

const AppContent = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return isAuthenticated ? (
        <MainApp />
    ) : (
        <Login />
    );
};

const MainApp = () => {
    const [view, setView] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const [chats, setChats] = useState([
        {
            id: 1,
            messages: [
                { type: 'user', message: "Bonjour, j'ai une question." },
                { type: 'assistant', message: "Je vous écoute, comment puis-je vous aider ?" }
            ]
        }
    ]);
    
    const [activeChat, setActiveChat] = useState(1);
    const [documents, setDocuments] = useState([]);
    const [ragParameters, setRagParameters] = useState({});
    
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        // Fermer le menu au changement de vue sur mobile
        if (window.innerWidth < 768) {
            closeMenu();
        }
        
        // Ferme le menu lors d'un clic en dehors sur mobile
        const handleClickOutside = (e) => {
            if (isMenuOpen && window.innerWidth < 768) {
                const menuElement = document.getElementById('sidebar-menu');
                const menuButton = document.getElementById('menu-toggle-button');
                
                if (menuElement && 
                    !menuElement.contains(e.target) && 
                    menuButton && 
                    !menuButton.contains(e.target)) {
                    closeMenu();
                }
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [view, isMenuOpen]);
    
    const menuItems = [];

    if(user?.role === "user"){
        menuItems.push(
            { id: "home", label: "Accueil", icon: HomeIcon },
            { id: "rag-settings", label: "Paramètres du RAG", icon: Settings },
            { id: "history", label: "Historique", icon: HistoryIcon },
        );
    } else {
        menuItems.push(
            { id: "home", label: "Accueil", icon: HomeIcon },
            { id: "add-documents", label: "Ajouter des documents", icon: Upload },
            { id: "rag-settings", label: "Paramètres du RAG", icon: Settings },
            { id: "history", label: "Historique", icon: HistoryIcon },
        );
    }

    const renderView = () => {
        switch (view) {
            case "add-documents":
                return <AddDocuments />;
            case "rag-settings":
                return <RagSettings />;
            case "history":
                return <History />;
            default:
                return <Home />;
        }
    };

    const menuVariants = {
        open: { 
            width: "16rem",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        },
        closed: { 
            width: "0rem",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        }
    };

    const menuItemVariants = {
        open: {
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.2,
                duration: 0.2
            }
        },
        closed: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <ChatContext.Provider value={{ chats, setChats, activeChat, setActiveChat }}>
            <DocumentContext.Provider value={{ documents, setDocuments }}>
                <RagContext.Provider value={{ ragParameters, setRagParameters }}>
                    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        {/* Menu Button */}
                        <Button
                            id="menu-toggle-button"
                            variant="ghost"
                            size="icon"
                            className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md rounded-full h-10 w-10"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <ChevronLeft className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Sidebar Menu */}
                        <motion.div
                            id="sidebar-menu"
                            className="fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-xl z-40 flex flex-col overflow-hidden"
                            initial="closed"
                            animate={isMenuOpen ? "open" : "closed"}
                            variants={menuVariants}
                        >
                            <div className="p-4 h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                                <motion.h1 
                                    className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate"
                                    variants={menuItemVariants}
                                >
                                    RAG Assistant
                                </motion.h1>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto py-6 px-4">
                                <nav className="space-y-2">
                                    <AnimatePresence>
                                        {isMenuOpen && menuItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                variants={menuItemVariants}
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                            >
                                                <Button
                                                    variant={view === item.id ? "default" : "ghost"}
                                                    className={`w-full justify-start mb-1 ${view === item.id ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                                                    onClick={() => setView(item.id)}
                                                >
                                                    <item.icon className="mr-2 h-5 w-5" />
                                                    {item.label}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </nav>
                            </div>
                            
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        className="p-4 border-t border-gray-200 dark:border-gray-700"
                                        variants={menuItemVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                    >
                                        <div className="mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
                                            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-medium text-sm truncate">{user?.email}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700"
                                            onClick={logout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Se déconnecter
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Overlay when menu is open on mobile */}
                        <AnimatePresence>
                            {isMenuOpen && window.innerWidth < 768 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/20 z-30"
                                    onClick={closeMenu}
                                />
                            )}
                        </AnimatePresence>

                        {/* Main Content */}
                        <main className="flex-1 overflow-hidden">
                            {renderView()}
                        </main>
                    </div>
                </RagContext.Provider>
            </DocumentContext.Provider>
        </ChatContext.Provider>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;