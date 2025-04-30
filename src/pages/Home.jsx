import React, { useState, useEffect, useRef } from "react";
import { 
    MessageSquare, 
    Send, 
    Plus, 
    Bot, 
    User, 
    Search, 
    Sparkles,
    Loader,
    MoreVertical,
    Trash2,
    Copy,
    Edit,
    X,
    Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
        <div className="mb-6 w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Comment puis-je vous aider aujourd'hui ?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            Posez une question ou demandez-moi d'effectuer une recherche dans votre base documentaire.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
            {[
                { title: "Rechercher un document", desc: "Quelles informations contient le document X sur le sujet Y ?" },
                { title: "Analyser des données", desc: "Peux-tu résumer les points clés du document sur Z ?" },
                { title: "Obtenir des explications", desc: "Explique-moi le concept de X mentionné dans mes documents." },
                { title: "Comparer des informations", desc: "Quelles sont les différences entre X et Y selon mes documents ?" }
            ].map((suggestion, idx) => (
                <button 
                    key={idx}
                    className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.desc}</p>
                </button>
            ))}
        </div>
    </div>
);

const TypeIndicator = ({ isTyping }) => (
    <AnimatePresence>
        {isTyping && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center text-gray-500 dark:text-gray-400 text-sm py-2 px-4"
            >
                <div className="flex space-x-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="ml-2">Assistant est en train d'écrire...</span>
            </motion.div>
        )}
    </AnimatePresence>
);

const MessageActions = ({ onCopy, onRegenerate, onDelete }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute top-0 right-0 mt-2 mr-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10"
    >
        <div className="p-1">
            <button 
                onClick={onCopy} 
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
                <Copy size={16} />
                <span>Copier</span>
            </button>
            <button 
                onClick={onRegenerate} 
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
                <Edit size={16} />
                <span>Régénérer</span>
            </button>
            <button 
                onClick={onDelete} 
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
                <Trash2 size={16} />
                <span>Supprimer</span>
            </button>
        </div>
    </motion.div>
);

const ChatMessage = ({ message, type, timestamp, index, isLast }) => {
    const [showActions, setShowActions] = useState(false);
    const actionRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionRef.current && !actionRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setShowActions(false);
    };
    
    const isSystemMessage = message.startsWith("**Système:**");
    if (isSystemMessage) {
        return (
            <div className="flex justify-center my-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                {message.replace("**Système:**", "")}
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
                group flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4 px-4 
                ${isLast ? 'pb-4' : ''}
            `}
        >
            <div className={`
                flex items-start gap-3 max-w-3xl group
                ${type === 'user' ? 'flex-row-reverse' : 'flex-row'}
            `}>
                <div className={`
                    flex-shrink-0 mt-1 w-10 h-10 rounded-full 
                    flex items-center justify-center shadow-md
                    ${type === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' 
                        : 'bg-gradient-to-br from-purple-600 to-indigo-600'}
                `}>
                    {type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                    ) : (
                        <Bot className="w-5 h-5 text-white" />
                    )}
                </div>
                <div 
                    className={`
                        relative rounded-2xl p-4 
                        ${type === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm'}
                    `}
                >
                    <p className="whitespace-pre-wrap">{message}</p>
                    
                    {timestamp && (
                        <div className="text-xs mt-2 opacity-70">
                            {timestamp}
                        </div>
                    )}
                    
                    {type === 'assistant' && (
                        <div className="absolute top-2 right-2" ref={actionRef}>
                            <button 
                                onClick={() => setShowActions(!showActions)} 
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical size={16} />
                            </button>
                            
                            <AnimatePresence>
                                {showActions && (
                                    <MessageActions 
                                        onCopy={handleCopy}
                                        onRegenerate={() => {}}
                                        onDelete={() => {}}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const ChatContainer = ({ messages = [], isTyping }) => {
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);
    
    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent relative">
            {messages.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="py-4">
                    {messages.map((msg, idx) => (
                        <ChatMessage 
                            key={idx}
                            message={msg.message}
                            type={msg.type}
                            timestamp={msg.timestamp}
                            index={idx}
                            isLast={idx === messages.length - 1}
                        />
                    ))}
                    <TypeIndicator isTyping={isTyping} />
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};

const ChatSidebar = ({ chats = [], activeChat, onSelectChat, onNewChat, onDeleteChat, visible, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredChats = chats.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation();
        onDeleteChat(chatId);
    };
    
    const sidebarVariants = {
        open: { 
            x: 0,
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        },
        closed: { 
            x: "-100%",
            opacity: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        }
    };
    
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-20 
                              border-r border-gray-200 dark:border-gray-700 flex flex-col md:relative"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={sidebarVariants}
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversations</h2>
                            <button 
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                                onClick={onClose}
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <Button
                            onClick={onNewChat}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-xl shadow-md transition-all duration-200"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nouvelle conversation
                        </Button>
                        
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder="Rechercher une conversation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-gray-100 dark:bg-gray-700 border-0"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <AnimatePresence>
                            {filteredChats.length > 0 ? (
                                filteredChats.map((chat) => (
                                    <motion.button
                                        key={chat.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => onSelectChat(chat.id)}
                                        className={`
                                            flex items-center justify-between w-full px-3 py-3 rounded-xl
                                            group transition-all duration-200
                                            ${activeChat === chat.id 
                                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100' 
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}
                                        `}
                                    >
                                        <div className="flex items-center overflow-hidden">
                                            <div className={`
                                                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3
                                                ${activeChat === chat.id 
                                                    ? 'bg-indigo-600 text-white' 
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                                            `}>
                                                <MessageSquare size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="font-medium truncate">{chat.title}</p>
                                                <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                                                    {chat.messages.length > 0 
                                                        ? chat.messages[chat.messages.length - 1].message.substring(0, 30) + "..." 
                                                        : "Nouvelle conversation"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => handleDeleteChat(e, chat.id)}
                                            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.button>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm 
                                            ? "Aucune conversation trouvée" 
                                            : "Aucune conversation"
                                        }
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const MessageInput = ({ value, onChange, onSend, disabled, collections, selectedCollection, onCollectionChange }) => {
    const textareaRef = useRef(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [value]);
    
    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                    <div className="w-full md:w-64">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Collection
                        </label>
                        <Select
                            value={selectedCollection}
                            onChange={onCollectionChange}
                            options={collections.map(collection => ({
                                value: collection,
                                label: collection
                            }))}
                            className="w-full"
                            placeholder="Sélectionner une collection"
                        />
                    </div>
                </div>

                <div className="relative rounded-xl border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Posez votre question..."
                        className="w-full pt-5 pb-12 px-5 resize-none outline-none bg-transparent rounded-xl dark:text-white text-base"
                        rows={2}
                        style={{ maxHeight: '150px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        disabled={disabled}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center">
                        <Button 
                            onClick={onSend}
                            disabled={disabled || !value.trim() || !selectedCollection}
                            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-2 h-11 w-11 flex items-center justify-center shadow-md disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {disabled ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                    <div className="absolute bottom-4 left-5 text-xs text-gray-500 dark:text-gray-400">
                        Appuyez sur <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700">Entrée</kbd> pour envoyer
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = ({ toggleChatSidebar }) => {
    const [chats, setChats] = useState([
        {
            id: 1,
            title: "Nouvelle conversation",
            messages: [
                { 
                    type: 'assistant', 
                    message: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]
        }
    ]);
    const [activeChat, setActiveChat] = useState(1);
    const [newMessage, setNewMessage] = useState("");
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isChatSidebarVisible, setIsChatSidebarVisible] = useState(false);
    const { user } = useAuth();
    const isMobile = useRef(window.innerWidth < 768);

    // Récupération des collections
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/collection/get");
                const data = await response.json();
                if (data.collections) {
                    setCollections(data.collections);
                    if (data.collections.length > 0) {
                        setSelectedCollection(data.collections[0]);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des collections:", error);
            }
        };

        fetchCollections();
        
        // Écran large : ouvrir le sidebar par défaut
        if (window.innerWidth >= 768) {
            setIsChatSidebarVisible(true);
        }
        
        const handleResize = () => {
            isMobile.current = window.innerWidth < 768;
            if (window.innerWidth >= 768) {
                setIsChatSidebarVisible(true);
            } else {
                setIsChatSidebarVisible(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedCollection || isLoading) return;

        setIsLoading(true);
        const messageToSend = newMessage.trim();
        setNewMessage("");
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Mise à jour du chat avec le message de l'utilisateur
        const updatedChats = chats.map(chat => {
            if (chat.id === activeChat) {
                // Mettre à jour le titre de la conversation si c'est le premier message
                const title = chat.messages.length <= 1 
                    ? messageToSend.length > 30 
                        ? messageToSend.substring(0, 30) + "..."
                        : messageToSend
                    : chat.title;
                
                return {
                    ...chat,
                    title,
                    messages: [...chat.messages, { type: 'user', message: messageToSend, timestamp }]
                };
            }
            return chat;
        });
        setChats(updatedChats);
        
        // Simuler la réponse en cours
        setIsTyping(true);

        try {
            const query_text = encodeURIComponent(messageToSend);
            const user_id = user.id;
            const collection = selectedCollection;

            // Attendre la réponse
            const response = await fetch(`http://127.0.0.1:5000/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query_text, user_id, collection })
            });

            const data = await response.json();
            
            // Petit délai pour une expérience plus naturelle
            setTimeout(() => {
                setIsTyping(false);
                
                // Ajouter la réponse de l'assistant
                const finalChats = updatedChats.map(chat => {
                    if (chat.id === activeChat) {
                        return {
                            ...chat,
                            messages: [...chat.messages, { 
                                type: 'assistant', 
                                message: data.response,
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]
                        };
                    }
                    return chat;
                });
                setChats(finalChats);
                setIsLoading(false);
            }, 500);
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête:", error);
            
            setIsTyping(false);
            // Afficher un message d'erreur
            const errorChats = updatedChats.map(chat => {
                if (chat.id === activeChat) {
                    return {
                        ...chat,
                        messages: [...chat.messages, { 
                            type: 'assistant', 
                            message: "**Système:** Désolé, une erreur est survenue lors du traitement de votre demande.",
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]
                    };
                }
                return chat;
            });
            setChats(errorChats);
            setIsLoading(false);
        }
    };

    const createNewChat = () => {
        const newChatId = Date.now();
        const newChat = {
            id: newChatId,
            title: "Nouvelle conversation",
            messages: [
                { 
                    type: 'assistant', 
                    message: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]
        };
        setChats([...chats, newChat]);
        setActiveChat(newChatId);
        // Fermer le sidebar en mobile
        if (isMobile.current) {
            setIsChatSidebarVisible(false);
        }
    };

    const selectChat = (chatId) => {
        setActiveChat(chatId);
        // Fermer le sidebar en mobile
        if (isMobile.current) {
            setIsChatSidebarVisible(false);
        }
    };

    const deleteChat = (chatId) => {
        const updatedChats = chats.filter(chat => chat.id !== chatId);
        setChats(updatedChats);
        
        // Si le chat actif est supprimé, passer au premier chat disponible
        if (activeChat === chatId && updatedChats.length > 0) {
            setActiveChat(updatedChats[0].id);
        } else if (updatedChats.length === 0) {
            createNewChat();
        }
    };

    const activeMessages = chats.find(c => c.id === activeChat)?.messages || [];

    const toggleChatList = () => {
        setIsChatSidebarVisible(!isChatSidebarVisible);
        if (toggleChatSidebar) toggleChatSidebar();
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Overlay pour mobile quand le sidebar est ouvert */}
            {isMobile.current && isChatSidebarVisible && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                    onClick={() => setIsChatSidebarVisible(false)}
                />
            )}
            
            {/* Sidebar de la liste des conversations */}
            <ChatSidebar 
                chats={chats}
                activeChat={activeChat}
                onSelectChat={selectChat}
                onNewChat={createNewChat}
                onDeleteChat={deleteChat}
                visible={isChatSidebarVisible}
                onClose={() => setIsChatSidebarVisible(false)}
            />
            
            {/* Zone de conversation - suppression de l'espace avec flex-1 et pas de gap */}
            <div className={`
                flex-1 flex flex-col bg-gray-50 dark:bg-gray-900
                ${isChatSidebarVisible && !isMobile.current ? 'border-l-0' : ''}
                transition-all duration-300
            `}>
                {/* En-tête de la conversation */}
                <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center shadow-sm">
                    {isMobile.current && (
                        <button 
                            onClick={toggleChatList}
                            className="mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <MessageSquare size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                            <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {chats.find(c => c.id === activeChat)?.title || "Nouvelle conversation"}
                        </h2>
                    </div>
                </div>
                
                {/* Messages */}
                <ChatContainer
                    messages={activeMessages}
                    isTyping={isTyping}
                />
                
                {/* Input de message */}
                <MessageInput 
                    value={newMessage}
                    onChange={setNewMessage}
                    onSend={handleSend}
                    disabled={isLoading}
                    collections={collections}
                    selectedCollection={selectedCollection}
                    onCollectionChange={setSelectedCollection}
                />
            </div>
        </div>
    );
};

export default Home;