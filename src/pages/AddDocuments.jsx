import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload, Plus, FileText, Database, Tag, Trash2, Check, AlertCircle, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Select } from "@/components/ui/select";

const AddDocuments = () => {
    const [inputValue, setInputValue] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(null); // 'success' or 'error'
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedCollectionForList, setSelectedCollectionForList] = useState("");
    const [tag, setTag] = useState("");
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    // Récupérer les collections
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/collection/get");
                const data = await response.json();
                if (response.ok) {
                    setCollections(data.collections || []);
                } else {
                    console.error("Erreur lors de la récupération des collections");
                }
            } catch (error) {
                console.error("Erreur de réseau :", error);
            }
        };

        fetchCollections();
    }, []);

    // Récupérer les documents pour la liste
    useEffect(() => {
        if (!selectedCollectionForList) return;

        const fetchDocuments = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/document/get?collection=${selectedCollectionForList}`);
                const data = await response.json();
                if (response.ok) {
                    setDocuments(data.documents || []);
                } else {
                    console.error("Erreur lors de la récupération des documents");
                }
            } catch (error) {
                console.error("Erreur lors du fetch des documents:", error);
            }
        };

        fetchDocuments();
    }, [selectedCollectionForList]);

    const handlePostRequest = async () => {
        if (!inputValue.trim()) return;
        
        setIsCreatingCollection(true);
        setResponseMessage("");
        setResponseStatus(null);

        try {
            const collection_name = encodeURIComponent(inputValue);

            const response = await fetch(`http://127.0.0.1:5000/collection/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ collection_name })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la requête");
            }

            setResponseMessage(`${data.message}`);
            setResponseStatus('success');
            setInputValue("");
            
            // Rafraîchir la liste des collections
            const collectionsResponse = await fetch("http://127.0.0.1:5000/collection/get");
            const collectionsData = await collectionsResponse.json();
            if (collectionsResponse.ok) {
                setCollections(collectionsData.collections || []);
            }
        } catch (error) {
            setResponseMessage(`Erreur: ${error.message}`);
            setResponseStatus('error');
        } finally {
            setIsCreatingCollection(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedCollection) return;
        
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('collection', selectedCollection);
        formData.append('user_id', user.id);
        formData.append('tag', tag);

        try {
            const response = await fetch('http://127.0.0.1:5000/document/add', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setFileName("");
                setSelectedFile(null);
                setTag("");
                
                // Toast de succès
                setResponseMessage("Document ajouté avec succès");
                setResponseStatus('success');

                // Rafraîchir la liste des documents si on est dans la même collection
                if (selectedCollectionForList === selectedCollection) {
                    const refreshed = await fetch(`http://127.0.0.1:5000/document/get?collection=${selectedCollection}`);
                    const refreshedData = await refreshed.json();
                    if (refreshed.ok) {
                        setDocuments(refreshedData.documents || []);
                    }
                }
            } else {
                setResponseMessage(`Erreur: ${data.error}`);
                setResponseStatus('error');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
            setResponseMessage("Erreur lors de l'envoi du fichier");
            setResponseStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    // Filtrer les documents en fonction du terme de recherche
    const filteredDocuments = documents.filter(doc => 
        doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (doc.tag && doc.tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col space-y-8 max-w-screen-xl mx-auto p-8">
            {/* Message de notification */}
            {responseMessage && (
                <div className={`
                    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3
                    ${responseStatus === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
                      responseStatus === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'}
                    transition-all duration-500 ease-in-out
                `}>
                    {responseStatus === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    <p>{responseMessage}</p>
                </div>
            )}

            <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-3">
                        <Database className="h-6 w-6" />
                        <h3 className="text-xl font-semibold">Créer une collection</h3>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nom de la collection
                        </label>
                        <div className="flex gap-3">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Entrez le nom de la collection..."
                                className="flex-grow shadow-sm"
                            />
                            <Button 
                                onClick={handlePostRequest} 
                                disabled={!inputValue.trim() || isCreatingCollection}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isCreatingCollection ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Création...
                                    </span>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5 mr-1" />
                                        Créer
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-3">
                        <Upload className="h-6 w-6" />
                        <h3 className="text-xl font-semibold">Déposer un document</h3>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-lg
                            p-10 flex flex-col items-center justify-center
                            transition-all duration-300
                            ${isDragging 
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                                : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}
                        `}
                    >
                        <div className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-4">
                            <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        {fileName ? (
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
                                    <span className="font-medium">{fileName}</span>
                                </p>
                                <Button 
                                    variant="ghost" 
                                    className="text-red-500 hover:text-red-600 p-1" 
                                    onClick={() => {
                                        setFileName("");
                                        setSelectedFile(null);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center font-medium">
                                    Glissez et déposez un fichier ici
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 text-center">
                                    ou cliquez pour en sélectionner un
                                </p>
                            </>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.zip"
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        
                        {!fileName && (
                            <Button 
                                variant="outline" 
                                onClick={() => fileInputRef.current.click()}
                                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                            >
                                Sélectionner un fichier
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="collectionSelect" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Collection
                            </label>
                            <Select
                                value={selectedCollection}
                                onChange={setSelectedCollection}
                                options={collections.map((collection) => ({
                                    value: collection,
                                    label: collection
                                }))}
                                placeholder="Sélectionner une collection"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tag" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tag (facultatif)
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    id="tag"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    placeholder="Entrez un tag"
                                    className="pl-9 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <Button
                        onClick={handleUpload}
                        className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                        disabled={!selectedFile || !selectedCollection || isUploading}
                    >
                        {isUploading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Envoi en cours...
                            </span>
                        ) : (
                            <>
                                <Upload className="mr-2 h-5 w-5" />
                                Envoyer le document
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="h-6 w-6" />
                            <h3 className="text-xl font-semibold">Liste des documents</h3>
                        </div>
                        <div className="text-sm">
                            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Collection
                                </label>
                                <Select
                                    value={selectedCollectionForList}
                                    onChange={setSelectedCollectionForList}
                                    options={collections.map((c) => ({ value: c, label: c }))}
                                    placeholder="Sélectionner une collection"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rechercher
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher par nom ou tag..."
                                        className="pl-9 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            {selectedCollectionForList ? (
                                filteredDocuments.length > 0 ? (
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredDocuments.map((doc, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                                                    <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {doc.file_name}
                                                    </h4>
                                                    {doc.tag && (
                                                        <div className="flex items-center mt-1">
                                                            <Tag className="h-3 w-3 text-gray-500 mr-1" />
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {doc.tag}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                                            Aucun document trouvé.
                                        </p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">
                                            Ajoutez des documents à cette collection ou modifiez vos critères de recherche.
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Sélectionnez une collection pour voir ses documents.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddDocuments;