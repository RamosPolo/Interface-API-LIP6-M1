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
    Database,
    ChevronRight,
    ChevronLeft,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.jsx";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

// Animation du message de bienvenue initial
const WelcomeMessage = ({ onComplete }) => {
    const [showMessage, setShowMessage] = useState(true);
    
    useEffect(() => {
        // Durée plus longue pour permettre de lire le message
        const timer = setTimeout(() => {
            setShowMessage(false);
            onComplete();
        }, 8000); // 8 secondes
        
        return () => clearTimeout(timer);
    }, [onComplete]);
    
    if (!showMessage) return null;
    
    return (
        <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            {/* Pattern décoratif en arrière-plan */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
            
            <motion.div 
                className="text-center px-8 max-w-2xl relative z-10"
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: -20, opacity: 0 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: 0.2
                }}
            >
                <div className="relative">
                    <motion.div 
                        className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl"
                        animate={{ 
                            y: [0, -15, 0],
                            rotateZ: [0, -5, 5, 0],
                        }}
                        transition={{ 
                            duration: 3, 
                            ease: "easeInOut",
                            times: [0, 0.5, 1],
                            repeat: Infinity
                        }}
                    >
                        <Bot className="h-14 w-14 text-white" />
                        
                        {/* Effet de pulsation amélioré autour du robot */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border-2 border-indigo-400/70 rounded-2xl"
                                initial={{ scale: 0.6, opacity: 0.6 }}
                                animate={{
                                    scale: [0.6, 1.2],
                                    opacity: [0.6, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: i * 0.5
                                }}
                            />
                        ))}
                        
                        {/* Brillance supplémentaire pour effet de profondeur */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"
                            animate={{
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        />
                    </motion.div>
                </div>
                
                <motion.h1 
                    className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Bonjour !
                </motion.h1>
                
                <motion.p 
                    className="text-xl md:text-2xl text-gray-900 dark:text-white mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    Comment puis-je vous aider aujourd'hui ?
                </motion.p>
                
                <motion.p
                    className="text-base text-gray-800 dark:text-gray-200 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                >
                    Je peux rechercher des informations dans vos documents, répondre à vos questions
                    et vous aider à analyser vos données.
                </motion.p>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8 }}
                    className="flex justify-center"
                >
                    <Button 
                        onClick={() => {
                            setShowMessage(false);
                            onComplete();
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                        Commencer
                    </Button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// Animation améliorée pour le robot qui réfléchit
const ThinkingAnimation = ({ isVisible }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center py-8 px-4"
            >
                <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center">
                    <div className="mr-4 relative">
                        <motion.div 
                            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                            animate={{ 
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <Bot className="h-8 w-8 text-white" />
                            
                            {/* Effet de pulsation pour simuler le "cerveau" qui travaille */}
                            <motion.div 
                                className="absolute inset-0 bg-white"
                                animate={{
                                    opacity: [0, 0.3, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "loop"
                                }}
                            />
                            
                            {/* Cercles d'énergie qui émanent du robot */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border-2 border-indigo-400 rounded-full"
                                    initial={{ scale: 0.5, opacity: 0.7 }}
                                    animate={{
                                        scale: [0.5, 1.5],
                                        opacity: [0.7, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: i * 0.5
                                    }}
                                />
                            ))}
                        </motion.div>
                        
                        {/* Petits éclairs autour du robot */}
                        <motion.div
                            className="absolute -top-1 -right-1 text-yellow-500"
                            animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        >
                            <Zap size={12} />
                        </motion.div>
                        
                        <motion.div
                            className="absolute -bottom-1 -left-1 text-yellow-500"
                            animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "loop",
                                delay: 0.5
                            }}
                        >
                            <Zap size={12} />
                        </motion.div>
                    </div>
                    
                    <div className="flex-1">
                        <motion.p 
                            className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2"
                            animate={{
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        >
                            Je réfléchis à votre demande...
                        </motion.p>
                        
                        <motion.p className="text-sm text-gray-600 dark:text-gray-400">
                            Analyse et traitement des informations en cours. <br />
                            Préparation d'une réponse pertinente.
                        </motion.p>
                        
                        <div className="flex space-x-2 mt-3">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                                    animate={{
                                        y: [0, -6, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: i * 0.15
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);
// Composants d'état vide et de messages
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
                <motion.button 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.desc}</p>
                </motion.button>
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

// Menu contextuel pour les messages
const MessageActions = ({ onCopy, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-5 right-2 flex gap-3 z-20"
        >
            <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCopy}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Copier"
            >
                <Copy size={16} />
            </motion.button>
        </motion.div>
    );
};
// Composant de message avec animations
const ChatMessage = ({ message, type, timestamp, index, isLast, totalMessages }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Pour les messages système
    const isSystemMessage = message.startsWith("**Système:**");
    if (isSystemMessage) {
        return (
            <div className="flex justify-center my-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                {message.replace("**Système:**", "")}
            </div>
        );
    }
    
    // Calculer le délai d'animation en fonction de la position
    const isNewMessage = totalMessages - index <= 2;
    const delay = isNewMessage ? 0.2 : 0;
    
    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        // Feedback visuel optionnel ici
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25, 
                delay: isNewMessage ? index * 0.1 : 0
            }}
            className={`
                group flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-6 px-4 
                ${isLast ? 'pb-4' : ''}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`
                flex items-start gap-3 max-w-3xl group relative
                ${type === 'user' ? 'flex-row-reverse' : 'flex-row'}
            `}>
                <motion.div 
                    className={`
                        flex-shrink-0 mt-1 w-10 h-10 rounded-full 
                        flex items-center justify-center shadow-md
                        ${type === 'user' 
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-800' 
                            : 'bg-gradient-to-br from-purple-600 to-indigo-600'}
                    `}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: delay + 0.1 }}
                >
                    {type === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                    ) : (
                        <Bot className="w-5 h-5 text-white" />
                    )}
                </motion.div>
                
                <div className="relative pb-6">
                    {/* Bulle de message */}
                    <motion.div 
                        className={`
                            rounded-2xl p-4 
                            ${type === 'user'
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm'}
                        `}
                        initial={{ 
                            opacity: 0,
                            scale: 0.95,
                            x: type === 'user' ? 20 : -20
                        }}
                        animate={{ 
                            opacity: 1,
                            scale: 1,
                            x: 0
                        }}
                        transition={{ 
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            delay: delay + 0.2
                        }}
                    >
                        <p className="whitespace-pre-wrap">{message}</p>
                        
                        {timestamp && (
                            <div className="text-xs mt-2 opacity-70">
                                {timestamp}
                            </div>
                        )}
                    </motion.div>
                    
                    {/* Icônes d'action minimalistes en bas du message */}
                    <AnimatePresence>
                        {isHovered && type === 'assistant' && (
                            <MessageActions 
                                onCopy={handleCopy}
                                onDelete={() => {}}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// Conteneur principal des messages
const ChatContainer = ({ messages = [], isTyping }) => {
    const bottomRef = useRef(null);
    const containerRef = useRef(null);
    const [showWelcome, setShowWelcome] = useState(messages.length <= 1);
    
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);
    
    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent relative">
            {showWelcome && messages.length <= 1 ? (
                <WelcomeMessage onComplete={() => setShowWelcome(false)} />
            ) : messages.length === 0 ? (
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
                            totalMessages={messages.length}
                        />
                    ))}
                    
                    {isTyping ? (
                        <ThinkingAnimation isVisible={isTyping} />
                    ) : (
                        <TypeIndicator isTyping={isTyping} />
                    )}
                    
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};

// Barre latérale des conversations
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
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
            }
        },
        closed: { 
            x: "100%",
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
                    className="fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-20 
                              border-l border-gray-200 dark:border-gray-700 flex flex-col md:relative"
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
                        
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={onNewChat}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nouvelle conversation
                            </Button>
                        </motion.div>
                        
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
                                filteredChats.map((chat, idx) => (
                                    <motion.button
                                        key={chat.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onSelectChat(chat.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            flex items-center justify-between w-full px-3 py-3 rounded-xl
                                            group transition-all duration-200
                                            ${activeChat === chat.id 
                                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100' 
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}
                                        `}
                                    >
                                        <div className="flex items-center overflow-hidden">
                                            <div className="flex-1 min-w-0 text-left">
                                                <p className="font-medium truncate">{chat.title}</p>
                                                <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                                                    {chat.messages.length > 0 
                                                        ? chat.messages[chat.messages.length - 1].message.substring(0, 30) + "..." 
                                                        : "Nouvelle conversation"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <motion.button 
                                            onClick={(e) => handleDeleteChat(e, chat.id)}
                                            className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </motion.button>
                                ))
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        animate={{ 
                                            y: [0, -10, 0],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{ 
                                            repeat: Infinity,
                                            duration: 3
                                        }}
                                    >
                                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                                    </motion.div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm 
                                            ? "Aucune conversation trouvée" 
                                            : "Aucune conversation"
                                        }
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Composant de saisie de message
const MessageInput = ({ value, onChange, onSend, disabled, collections, selectedCollection, onCollectionChange }) => {
    const textareaRef = useRef(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            // Permet d'avoir une zone de texte plus grande qui peut contenir plus de texte
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 250) + 'px';
        }
    }, [value]);
    
    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6"
                >
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
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative rounded-xl border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
                >
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Posez votre question... Vous pouvez écrire un texte plus long en utilisant Shift+Entrée pour ajouter des sauts de ligne."
                        className="w-full pt-5 pb-16 px-5 resize-none outline-none bg-transparent rounded-xl dark:text-white text-base"
                        rows={3}
                        style={{ minHeight: '120px', maxHeight: '250px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                        disabled={disabled}
                    />
                    <div className="absolute bottom-3 right-3 flex items-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                onClick={onSend}
                                disabled={disabled || !value.trim() || !selectedCollection}
                                className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-2 h-12 w-12 flex items-center justify-center shadow-md disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {disabled ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </Button>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-4 left-5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                            <kbd className="px-1.5 py-0.5 mr-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm">Shift</kbd> 
                            + 
                            <kbd className="px-1.5 py-0.5 mx-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm">Entrée</kbd> 
                            pour ajouter un saut de ligne • 
                            <kbd className="px-1.5 py-0.5 mx-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-sm">Entrée</kbd> 
                            pour envoyer
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
// Composant principal Home
const Home = () => {
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
        
        const handleResize = () => {
            isMobile.current = window.innerWidth < 768;
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
            
            // Délai plus long pour permettre de voir l'animation de réflexion
            // Entre 3 et 6 secondes selon la longueur de la réponse
            const responseLength = data.response?.length || 0;
            const thinkingTime = Math.min(3000 + (responseLength / 100), 6000);
            
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
            }, thinkingTime);
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

    const toggleChatSidebar = () => {
        setIsChatSidebarVisible(!isChatSidebarVisible);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Zone principale de chat */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
                {/* En-tête de la conversation */}
                <div className="py-3 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm">
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                            <MessageSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {chats.find(c => c.id === activeChat)?.title || "Nouvelle conversation"}
                        </h2>
                    </div>
                    
                    {/* Bouton pour ouvrir le menu des conversations à droite */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center ml-2"
                        onClick={toggleChatSidebar}
                    >
                        {isChatSidebarVisible ? (
                            <ChevronRight className="h-5 w-5 mr-1" />
                        ) : (
                            <ChevronLeft className="h-5 w-5 mr-1" />
                        )}
                        <span className="hidden md:inline">Conversations</span>
                    </Button>
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
            
            {/* Overlay pour mobile quand le sidebar est ouvert */}
            {isMobile.current && isChatSidebarVisible && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                    onClick={() => setIsChatSidebarVisible(false)}
                />
            )}
            
            {/* Menu des conversations à droite */}
            <ChatSidebar 
                chats={chats}
                activeChat={activeChat}
                onSelectChat={selectChat}
                onNewChat={createNewChat}
                onDeleteChat={deleteChat}
                visible={isChatSidebarVisible}
                onClose={() => setIsChatSidebarVisible(false)}
            />
        </div>
    );
};

export default Home;