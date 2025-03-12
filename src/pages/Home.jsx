import React, { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Plus, Bot, User } from "lucide-react";

// Composant pour afficher un message de chat
const ChatMessage = ({ message, type }) => (
    <div className={`flex gap-4 ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`
            flex items-start gap-3 max-w-[80%]
            ${type === 'user' ? 'flex-row-reverse' : 'flex-row'}
        `}>
            <div className={`
                flex-shrink-0 w-8 h-8 rounded-full 
                flex items-center justify-center
                ${type === 'user' ? 'bg-indigo-600' : 'bg-gray-600'}
            `}>
                {type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>
            <div className={`
                rounded-lg p-4
                ${type === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}
            `}>
                {message}
            </div>
        </div>
    </div>
);

// Composant pour afficher la liste des messages de chat
const ChatContainer = ({ messages }) => (
    <div className="flex-1 overflow-auto p-4">
        {messages.map((msg, idx) => (
            <ChatMessage key={idx} {...msg} />
        ))}
    </div>
);

// Composant principal de la page Home
const Home = () => {
    // État pour gérer les chats
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
    const [newMessage, setNewMessage] = useState("");

    // Fonction pour envoyer un message
    const handleSend = async () => {
        if (!newMessage.trim()) return;

        // Ajouter le message de l'utilisateur
        const updatedChats = chats.map(chat => {
            if (chat.id === activeChat) {
                return {
                    ...chat,
                    messages: [...chat.messages, { type: 'user', message: newMessage.trim() }]
                };
            }
            return chat;
        });
        setChats(updatedChats);
        setNewMessage("");

        // Envoyer la requête à l'API
        try {
            const response = await fetch(`http://127.0.0.1:5000/query/${encodeURIComponent(newMessage.trim())}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            // Ajouter la réponse de l'assistant
            const updatedChatsWithResponse = updatedChats.map(chat => {
                if (chat.id === activeChat) {
                    return {
                        ...chat,
                        messages: [...chat.messages,
                            { type: 'assistant', message: data.response }
                        ]
                    };
                }
                return chat;
            });
            setChats(updatedChatsWithResponse);
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête:", error);
        }
    };

    // Fonction pour créer une nouvelle conversation
    const createNewChat = () => {
        const newChat = {
            id: chats.length + 1,
            messages: []
        };
        setChats([...chats, newChat]);
        setActiveChat(newChat.id);
    };

    return (
        <div className="flex h-full gap-4">
            {/* Liste des chats */}
            <div className="w-64 shrink-0 hidden lg:flex flex-col gap-4">
                <Button
                    onClick={createNewChat}
                    className="w-full"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle conversation
                </Button>
                <div className="flex-1 overflow-auto space-y-2">
                    {chats.map((chat) => (
                        <Button
                            key={chat.id}
                            variant={activeChat === chat.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setActiveChat(chat.id)}
                        >
                            Chat #{chat.id}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Zone principale de chat */}
            <Card className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden flex flex-col">
                    <ChatContainer
                        messages={chats.find(c => c.id === activeChat)?.messages || []}
                    />
                    <div className="p-4 border-t dark:border-gray-800">
                        <div className="relative">
                            <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="pr-12 resize-none"
                                rows={3}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSend}
                                className="absolute bottom-2 right-2"
                                disabled={!newMessage.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Home;