import React, { useContext, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RagContext } from "../App";

const ParameterItem = ({ label, value, unit = "", onChange }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </span>
        <div className="flex items-center gap-2">
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-24 text-right"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[30px]">
                {unit}
            </span>
        </div>
    </div>
);

const RagSettings = () => {
    const { ragParameters, setRagParameters } = useContext(RagContext);
    const [localParameters, setLocalParameters] = useState(ragParameters);
    const [hasChanges, setHasChanges] = useState(false);

    const updateParameter = (key, value) => {
        setLocalParameters(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const handleSaveParameters = async () => {
        try {
            // Ici, vous pourriez appeler votre API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRagParameters(localParameters);
            setHasChanges(false);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde des paramètres:", err);
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Paramètres du RAG
                    </h3>
                </div>
                {hasChanges && (
                    <Button onClick={handleSaveParameters} className="gap-2">
                        <Save className="w-4 h-4" />
                        Sauvegarder
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <ParameterItem
                        label="Vitesse de traitement"
                        value={localParameters.vitesse}
                        unit="ms"
                        onChange={(value) => updateParameter('vitesse', value)}
                    />
                    <ParameterItem
                        label="Fichiers indexés"
                        value={localParameters.files}
                        onChange={(value) => updateParameter('files', value)}
                    />
                    <ParameterItem
                        label="Valeur K"
                        value={localParameters.kValue}
                        onChange={(value) => updateParameter('kValue', value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default RagSettings;