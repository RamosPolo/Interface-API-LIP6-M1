import React, { useState, createContext, useContext } from "react";
import Home from "@/pages/Home";
import AddDocuments from "@/pages/AddDocuments";
import RagSettings from "@/pages/RagSettings";
import History from "@/pages/History";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu, Home as HomeIcon, Upload, Settings, History as HistoryIcon } from "lucide-react";
import Login from "@/pages/Login.jsx";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";

export const ChatContext = createContext();
export const DocumentContext = createContext();
export const RagContext = createContext();

const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? (
        <MainApp />
    ) : (
        <Login />
    );
};

const MainApp = () => {
    const [view, setView] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout } = useAuth();

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

    const [ragParameters, setRagParameters] = useState({
        vitesse: 40,
        files: 12,
        kValue: 2
    });

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const menuItems = [
        { id: "home", label: "Accueil", icon: HomeIcon },
        { id: "add-documents", label: "Ajouter des documents", icon: Upload },
        { id: "rag-settings", label: "Paramètres du RAG", icon: Settings },
        { id: "history", label: "Historique", icon: HistoryIcon },
    ];

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

    return (
        <ChatContext.Provider value={{ chats, setChats, activeChat, setActiveChat }}>
            <DocumentContext.Provider value={{ documents, setDocuments }}>
                <RagContext.Provider value={{ ragParameters, setRagParameters }}>
                    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`
                                fixed top-4 left-4 z-50
                                transition-transform duration-200
                                ${isMenuOpen ? 'translate-x-48' : 'translate-x-0'}
                            `}
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? (
                                <ChevronLeft className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>

                        <div
                            className={`
                                fixed inset-y-0 left-0
                                w-56
                                bg-gray-900 
                                text-white 
                                p-4 
                                pt-16
                                flex flex-col 
                                transform transition-transform duration-200 ease-in-out
                                z-40
                                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                            `}
                        >
                            <nav className="space-y-2 flex-1">
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant={view === item.id ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        onClick={() => {
                                            setView(item.id);
                                            closeMenu();
                                        }}
                                    >
                                        <item.icon className="mr-2 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                ))}
                            </nav>
                            <Button
                                variant="destructive"
                                className="w-full mt-4"
                                onClick={logout}
                            >
                                Se déconnecter
                            </Button>
                        </div>

                        {isMenuOpen && (
                            <div
                                className="fixed inset-0 bg-black/20 z-30"
                                onClick={closeMenu}
                            />
                        )}

                        <div className="flex-1 overflow-hidden">
                            <main className="h-full p-4 pt-16">
                                {renderView()}
                            </main>
                        </div>
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