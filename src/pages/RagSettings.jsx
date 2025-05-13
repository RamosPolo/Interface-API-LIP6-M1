import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Settings, Save, HelpCircle, AlertCircle, Check, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext.jsx";
import { NotificationAnimation } from "@/components/Animations";

const InfoTooltip = ({ text }) => (
    <div className="relative group">
        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            {text}
        </div>
    </div>
);

const ParameterItem = ({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    multiline = false, 
    options = [], 
    tooltip, 
    disabled = false,
    isLimited = false 
}) => (
    <div className={`
        rounded-lg border p-4 
        ${disabled ? 'bg-gray-100 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-800'} 
        ${isLimited ? 'border-orange-200 dark:border-orange-900' : 'border-gray-200 dark:border-gray-700'} 
        transition-all duration-200 hover:shadow-sm
    `}>
        <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            {tooltip && <InfoTooltip text={tooltip} />}
            {isLimited && disabled && (
                <span className="ml-auto text-xs px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                    Accès limité
                </span>
            )}
        </div>
        {options.length > 0 ? (
            <Select
                value={value}
                onChange={onChange}
                options={options}
                className="w-full"
                disabled={disabled}
            />
        ) : multiline ? (
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-h-[120px] font-mono text-sm"
                disabled={disabled}
            />
        ) : (
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
                className="w-full"
                disabled={disabled}
            />
        )}
    </div>
);

const RagSettings = () => {
    const { user, userParameters, setUserParameters } = useAuth();
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (userParameters) {
            setUserParameters(userParameters);
        }
    }, [userParameters, setUserParameters]);

    const refreshParameters = async () => {
        if (!user?.id) return;
        
        setIsRefreshing(true);
        
        try {
            const paramsResponse = await fetch(`http://127.0.0.1:5000/parameters/get?user_id=${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (paramsResponse.ok) {
                const userParams = await paramsResponse.json();
                setUserParameters(userParams.data);
                localStorage.setItem("userParameters", JSON.stringify(userParams.data));
                setResponseMessage(`${userParams.message}`);
                setResponseStatus('success');
            }
        } catch (error) {
            setResponseMessage(`Erreur: ${error.message}`);
            setResponseStatus('error');
        } finally {
            setIsRefreshing(false);
        }
    };

    const updateParameter = (key, value) => {
        setUserParameters((prev) => {
            const newParams = { ...prev, [key]: value };
            setHasChanges(true);
            return newParams;
        });
    };

    const handleSaveParameters = async () => {
        if (!user?.id) return;
    
        const requestBody = {
            user_id: user.id,
            parameters: { ...userParameters }
        };

        setLoading(true);
        setResponseMessage("");
        setResponseStatus(null);
    
        try {
            const response = await fetch("http://127.0.0.1:5000/parameters/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Erreur serveur:", errorDetails);
                throw new Error("Erreur lors de la sauvegarde des paramètres");
            }

            if (response.ok) {
                const result = await response.json();
                setResponseMessage(`${result.message}`);
                setResponseStatus('success');
                setHasChanges(false);
            }

        } catch (error) {
            setResponseMessage(`Erreur: ${error.message}`);
            setResponseStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour fermer les notifications
    const closeNotification = () => {
        setResponseMessage("");
        setResponseStatus(null);
    };

    return (
        <div className="flex flex-col space-y-8 max-w-screen-xl h-screen max-h-screen mx-auto p-8 overflow-auto">
            {/* Notification */}
            <NotificationAnimation 
                responseMessage={responseMessage} 
                responseStatus={responseStatus}
                onClose={closeNotification}
            />

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6" />
                            <h3 className="text-xl font-semibold">Paramètres du RAG</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button 
                                onClick={refreshParameters} 
                                className="bg-white/20 hover:bg-white/30 text-white"
                                size="sm"
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Rafraîchir
                            </Button>
                            {hasChanges && (
                                <Button 
                                    onClick={handleSaveParameters} 
                                    className="bg-white text-indigo-600 hover:bg-gray-100"
                                    size="sm"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enregistrement...
                                        </span>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-1" />
                                            Sauvegarder
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {!isAdmin && (
                        <div className="mb-6 p-4 bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg flex items-start gap-3">
                            <Lock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Accès limité aux paramètres</p>
                                <p className="text-sm mt-1">En tant qu'utilisateur, vous pouvez uniquement modifier le modèle LLM. Les autres paramètres ne sont accessibles qu'aux administrateurs.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-6">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Paramètres du modèle</h4>
                            
                            <ParameterItem
                                label="Modèle LLM"
                                value={userParameters?.llm_model || ""}
                                onChange={(value) => updateParameter("llm_model", value)}
                                options={userParameters?.available_llm_models?.map(model => ({
                                    value: model,
                                    label: model.charAt(0).toUpperCase() + model.slice(1).replace("-", " ")
                                })) || []}
                                tooltip="Choisissez le modèle LLM que vous souhaitez utiliser pour les calculs."
                            />
                            
                            <ParameterItem
                                label="Taille des chunks (caractères)"
                                value={userParameters?.split_chunk_size || 0}
                                onChange={(value) => updateParameter("split_chunk_size", value)}
                                type="number"
                                tooltip="Définissez la taille (caractères) des morceaux de texte pour le traitement. Une taille plus grande permet de capturer plus de contexte, mais peut ralentir le traitement."
                                disabled={!isAdmin}
                                isLimited={true}
                            />
                            
                            <ParameterItem
                                label="Taille du chevauchement entre chunks (caractères)"
                                value={userParameters?.split_chunk_overlap || 0}
                                onChange={(value) => updateParameter("split_chunk_overlap", value)}
                                type="number"
                                tooltip="Définissez la taille (caractères) du chevauchement entre chaque morceau de texte. Un chevauchement plus important peut améliorer la cohérence, mais augmente le nombre de chunks."
                                disabled={!isAdmin}
                                isLimited={true}
                            />
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Paramètres de recherche</h4>
                            
                            <ParameterItem
                                label="Seuil de similarité"
                                value={userParameters?.similarity_treshold || 0}
                                onChange={(value) => updateParameter("similarity_treshold", value)}
                                type="number"
                                tooltip="Définissez le seuil de similarité pour filtrer les résultats. Une valeur plus élevée signifie que seuls les résultats les plus pertinents seront inclus."
                                disabled={!isAdmin}
                                isLimited={true}
                            />
                            
                            <ParameterItem
                                label="Valeur K"
                                value={userParameters?.k || 0}
                                onChange={(value) => updateParameter("k", value)}
                                type="number"
                                tooltip="Définissez le nombre K des résultats à récupérer. Une valeur plus élevée inclura plus de contexte, mais pourrait diluer la pertinence."
                                disabled={!isAdmin}
                                isLimited={true}
                            />
                        </div>
                        
                        <div className="space-y-6 lg:col-span-1">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Template du prompt</h4>
                            
                            <ParameterItem
                                label="Template du prompt"
                                value={userParameters?.prompt_template || ""}
                                onChange={(value) => updateParameter("prompt_template", value)}
                                multiline
                                tooltip="Définissez le modèle de prompt à utiliser dans les requêtes. Ce template guide le modèle sur la façon de répondre aux questions en se basant sur le contexte fourni."
                                disabled={!isAdmin}
                                isLimited={true}
                            />                   

                            <div className="rounded-lg border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-sm"                       >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Template par défaut</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">                            
                                    Tu es un assistant pédagogique pour une filière informatique à l’université.
                                    Ta tâche est d’aider les étudiants en répondant à leurs questions en te basant uniquement sur le contenu fourni.
                                    Si tu ne trouves pas la réponse dans le contexte, dis-le clairement sans inventer.
                                    Indique à la fin de ta réponse de quel document ou extrait provient l’information, si possible.
                                    Explique si besoin avec un exemple ou un résumé du concept.
                                    Réponds de manière claire, précise et pédagogique.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="flex justify-between p-6 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Les modifications des paramètres affecteront les futures requêtes.
                    </p>
                    
                    {hasChanges && (
                        <Button 
                            onClick={handleSaveParameters} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </span>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Sauvegarder les modifications
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default RagSettings;