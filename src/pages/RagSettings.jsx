import React, {useState} from "react";
import { Card, CardContent } from "@/components/ui/card";

const RagSettings = () => {

    /* Récupère l'etat du RAG */
    const getParametersRAG = async () => {
        try {
            const res = await fetch("https://api.example.com/rag-status", {
                method: "GET", // Généralement, un GET suffit pour récupérer l'état
                headers: {
                    "Content-Type": "application/json",
                },
            });

            /* Verifier l'etat de la récupération des données */
            if (!res.ok) {
                throw new Error("Erreur lors de la récupération des paramètres du RAG.");
            }

            const data = await res.json();
            console.log("État du RAG reçu :", data);
            return data;
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
            return null;
        }
    };

    const [ragParameters, setRagParameters] = useState(null);
    const [enter, setEnter] = useState(false);

    const handleFetchRAG = async () => {

        // On récupère les données
        // const data = await getParametersRAG();

        // Pour le test
        let data = {vitesse:40, files:12, kValue:2}
        if (data) {
            setRagParameters(data);
        }
    };


    return (
        <Card className="flex-1">
            <CardContent>
                <h3 className="text-xl font-bold mb-4">Paramètres du RAG</h3>
                {ragParameters && enter ? (
                    <ul className="list-disc pl-5">
                        {Object.entries(ragParameters).map(([key, value]) => (
                            <li key={key} className="mb-2">
                                <strong>{key}:</strong> {value.toString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Chargement des paramètres...</p>
                )}
            </CardContent>
        </Card>
    );
};

export default RagSettings;
