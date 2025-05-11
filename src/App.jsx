import React, { useState, createContext, useContext, useEffect } from "react";
import Home from "@/pages/Home";
import AddDocuments from "@/pages/AddDocuments";
import RagSettings from "@/pages/RagSettings";
import History from "@/pages/History";
import { Button } from "@/components/ui/button";
import { 
    Home as HomeIcon, 
    Upload, 
    Settings, 
    History as HistoryIcon, 
    LogOut,
    User
} from "lucide-react";
import Login from "@/pages/Login.jsx";
import { AuthProvider, useAuth } from "@/context/AuthContext.jsx";

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
    
    // Liste des éléments du menu en fonction du rôle
    const menuItems = [];

    if(user?.role === "user"){
        menuItems.push(
            { id: "home", label: "Accueil", icon: HomeIcon },
            { id: "rag-settings", label: "Paramètres du RAG", icon: Settings }
        );
    } else {
        menuItems.push(
            { id: "home", label: "Accueil", icon: HomeIcon },
            { id: "add-documents", label: "Ajouter des documents", icon: Upload },
            { id: "rag-settings", label: "Paramètres du RAG", icon: Settings }
        );
    }

    const renderView = () => {
        switch (view) {
            case "add-documents":
                return <AddDocuments />;
            case "rag-settings":
                return <RagSettings />;
            default:
                return <Home />;
        }
    };

    return (
        <ChatContext.Provider value={{ chats, setChats, activeChat, setActiveChat }}>
            <DocumentContext.Provider value={{ documents, setDocuments }}>
                <RagContext.Provider value={{ ragParameters, setRagParameters }}>
                    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
                        {/* Sidebar Menu - permanent */}
                        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
                            {/* Logo Header */}
                            <div className="p-4 h-16 flex items-center border-b border-gray-200 dark:border-gray-700">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    RAG Assistant
                                </h1>
                            </div>
                            
                            {/* Navigation */}
                            <div className="flex-1 overflow-y-auto py-6 px-4">
                                <nav className="space-y-2">
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.id}
                                            variant={view === item.id ? "default" : "ghost"}
                                            className={`w-full justify-start mb-2 ${view === item.id ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                                            onClick={() => setView(item.id)}
                                        >
                                            <item.icon className="mr-2 h-5 w-5" />
                                            {item.label}
                                        </Button>
                                    ))}
                                </nav>
                            </div>
                            
                            {/* User Profile and Logout */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="mb-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
                                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{user?.email}</p>
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
                            </div>
                        </div>

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