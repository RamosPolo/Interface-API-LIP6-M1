import React, { useContext, useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Settings, Save, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext.jsx";

const ParameterItem = ({ label, value, onChange, type = "text", multiline = false, options = [], tooltip, disabled = false }) => (
    <div className="flex flex-col gap-2 w-full h-full">
        <div className="flex items-center gap-2 w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            {tooltip && (
                <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
                    <div className="tooltip-text absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded p-2 mt-1 z-10 w-64 transition-opacity duration-200 opacity-0 group-hover:opacity-100 left-full top-0 ml-2">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>
        {options.length > 0 ? (
            <Select
                value={value}
                onChange={onChange}
                options={options}
                className="w-full h-full text-left"
                disabled={disabled}
            />
        ) : multiline ? (
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full text-left"
                disabled={disabled}
            />
        ) : (
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="w-full h-full text-left"
                disabled={disabled}
            />
        )}
    </div>
);

const RagSettings = () => {
    const { user, userParameters, setUserParameters } = useAuth();
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (userParameters) {
            setUserParameters(userParameters);
        }
    }, [userParameters, setUserParameters]);

    const updateParameter = (key, value) => {

        setUserParameters((prev) => {
            const newParams = { ...prev, [key]: value };
            setHasChanges(true);
            return newParams;
        });
    };

    const handleSaveParameters = async () => {
        if (!user) return;
    
        const requestBody = {
            user_id: user.id,
            parameters: { ...userParameters }
        };
    
        setLoading(true);
    
        try {
            const response = await fetch("http://127.0.0.1:5000/parameters/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Erreur serveur:", errorDetails);
                throw new Error("Erreur API");
            }
    
            setHasChanges(false);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
        } finally {
            setLoading(false);
        }
    };    

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Settings className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Paramètres du RAG</h3>
                    </div>
                    {hasChanges && (
                        <Button onClick={handleSaveParameters} className="gap-2" disabled={loading}>
                            {loading ? "Enregistrement..." : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Sauvegarder
                                </>
                            )}
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex gap-8">
                        <div className="flex flex-col gap-8 w-1/3">
                            <ParameterItem
                                label="Modèle LLM"
                                value={userParameters.llm_model || ""}
                                onChange={(value) => updateParameter("llm_model", value)}
                                options={userParameters.available_llm_models?.map(model => ({
                                    value: model,
                                    label: model.charAt(0).toUpperCase() + model.slice(1).replace("-", " ")
                                })) || []}
                                tooltip="Choisissez le modèle LLM que vous souhaitez utiliser pour les calculs."
                            />
                            <ParameterItem
                                label="Taille des chunks"
                                value={userParameters.split_chunk_size || 0}
                                onChange={(value) => updateParameter("split_chunk_size", value)}
                                type="number"
                                tooltip="Définissez la taille des morceaux de texte pour le traitement."
                                disabled={user.role == "user"}
                            />
                            <ParameterItem
                                label="Taille du chevauchement entre chunks"
                                value={userParameters.split_chunk_overlap || 0}
                                onChange={(value) => updateParameter("split_chunk_overlap", value)}
                                type="number"
                                tooltip="Définissez la taille du chevauchement entre chaque morceau de texte."
                                disabled={user.role == "user"}
                            />
                            <ParameterItem
                                label="Seuil de similarité"
                                value={userParameters.similarity_treshold || 0}
                                onChange={(value) => updateParameter("similarity_treshold", value)}
                                type="number"
                                tooltip="Définissez le seuil de similarité pour filtrer les résultats."
                                disabled={user.role == "user"}
                            />
                            <ParameterItem
                                label="Valeur K"
                                value={userParameters.k || 0}
                                onChange={(value) => updateParameter("k", value)}
                                type="number"
                                tooltip="Définissez le nombre K des résultats à récupérer."
                                disabled={user.role == "user"}
                            />
                        </div>
                        <div className="flex flex-col gap-8 w-2/3">
                            <ParameterItem
                                label="Template du prompt"
                                value={userParameters.prompt_template || ""}
                                onChange={(value) => updateParameter("prompt_template", value)}
                                multiline
                                tooltip="Définissez le modèle de prompt à utiliser dans les requêtes."
                                disabled={user.role == "user"}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RagSettings;