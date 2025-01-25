import React, { useState } from "react";
import Home from "@/pages/Home";
import AddDocuments from "@/pages/AddDocuments";
import RagSettings from "@/pages/RagSettings";
import History from "@/pages/History";
import { Button } from "@/components/ui/button";

const App = () => {
    const [view, setView] = useState("home");
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleQuerySubmit = async () => {
        try {
            const res = await fetch("https://api.example.com/endpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            console.log("Demande envoyée: " + JSON.stringify({ query }));
            setSubmitted(true);
            const data = await res.json();
            setResponse(data.answer || "Aucune réponse trouvée");
        } catch (error) {
            setResponse("Erreur lors de la communication avec l'API.");
        }
    };

    const renderView = () => {
        switch (view) {
            case "add-documents":
                return <AddDocuments />;
            case "rag-settings":
                return <RagSettings enter={true}/>;
            case "history":
                return <History />;
            default:
                return (
                    <Home
                        query={query}
                        setQuery={setQuery}
                        handleQuerySubmit={handleQuerySubmit}
                        response={response}
                        submitted={submitted}
                    />
                );
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col space-y-4">
                <h2 className="text-xl font-bold mb-4">Menu</h2>
                <Button variant="ghost" className="text-left" onClick={() => setView("home")}>
                    Accueil
                </Button>
                <Button variant="ghost" className="text-left" onClick={() => setView("add-documents")}>
                    Ajouter des documents
                </Button>
                <Button variant="ghost" className="text-left" onClick={() => setView("rag-settings")}>
                    Paramètres du RAG
                </Button>
                <Button variant="ghost" className="text-left" onClick={() => setView("history")}>
                    Historique
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6">{renderView()}</div>
        </div>
    );
};

export default App;
