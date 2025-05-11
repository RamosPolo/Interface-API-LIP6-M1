import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload, Plus, FileText, Database, Tag, Trash2, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Select } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

import {
    // Animations pour les tags
    TagAnimations,
    
    // Animations pour les documents
    NotificationAnimation,
    FileUploadAnimation,
    DropzoneAnimation,
    SuccessAnimation, 
    DeleteConfirmation,
    UploadingAnimation,
    AnimatedUploadButton,
  } from "@/components/Animations";

const GestionCollections = () => {
    // États existants
    const [inputValue, setInputValue] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedCollectionForList, setSelectedCollectionForList] = useState("");
    const [documentsByTag, setDocumentsByTag] = useState([]);
    const [tags, setTags] = useState([]);
    const [dbTags, setDbTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [input, setInput] = useState("");
    const [documents, setDocuments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [uploadMode, setUploadMode] = useState("single");
    
    // Nouveaux états pour les animations
    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteDocumentConfirmation, setShowDeleteDocumentConfirmation] = useState(false);
    const [showDeleteTagConfirmation, setShowDeleteTagConfirmation] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [showTagFeedback, setShowTagFeedback] = useState(false);
    const [lastAddedTag, setLastAddedTag] = useState("");
    
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    // Récupérer les collections
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                console.log("Tentative de récupération des collections...");
                const response = await fetch("http://127.0.0.1:5000/collection/get");
                console.log("Réponse reçue:", response);
                const data = await response.json();
                console.log("Données reçues:", data);
                
                if (response.ok) {
                    console.log("Collections récupérées avec succès:", data.collections);
                    setCollections(data.collections || []);

                    if (!selectedCollection && data.collections && data.collections.length > 0) {
                        console.log("Sélection de la première collection:", data.collections[0]);
                        setSelectedCollection(data.collections[0]);
                    } else {
                        console.log("Aucune collection à sélectionner ou déjà sélectionnée", selectedCollection);
                    }
                } else {
                    console.error("Erreur lors de la récupération des collections, statut:", response.status);
                }
            } catch (error) {
                console.error("Erreur de réseau lors de la récupération des collections:", error);
            }
        };

        fetchCollections();
    }, []);

    // 🔹 Récupérer tous les tags
    useEffect(() => {
        const fetchTags = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/document/get_tags");
            const data = await response.json();
            if (response.ok) {
            setDbTags(data.tags || []);
            } else {
            console.error("Erreur lors de la récupération des tags");
            }
        } catch (error) {
            console.error("Erreur lors du fetch des tags:", error);
        }
        };

        fetchTags();
    }, []);

    // 🔹 Récupérer les documents pour le tag sélectionné
    useEffect(() => {
        if (!selectedTag) return;

        const fetchDocumentsByTag = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/document/get_by_tag?tag=${selectedTag}`);
            const data = await response.json();
            if (response.ok) {
            setDocumentsByTag(data.documents || []);
            } else {
            console.error("Erreur lors de la récupération des documents");
            }
        } catch (error) {
            console.error("Erreur lors du fetch des documents:", error);
        }
        };

        fetchDocumentsByTag();
    }, [selectedTag]);

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

    // Fonction pour fermer les notifications
    const closeNotification = () => {
        setResponseMessage("");
        setResponseStatus(null);
    };

    // Version améliorée de handlePostRequest
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

    // Gestion améliorée des tags
    const addTag = (value) => {
        const trimmed = value.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setInput("");
            
            // Afficher le feedback visuel
            setLastAddedTag(trimmed);
            setShowTagFeedback(true);
            
            // Masquer après 3 secondes
            setTimeout(() => {
                setShowTagFeedback(false);
            }, 3000);
        }
    };
    
    const handleKeyDown = (e) => {
        if (["Enter", ",", "Tab"].includes(e.key)) {
            e.preventDefault();
            addTag(input);
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    // Version améliorée de handleDragOver
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Version améliorée du dépôt de fichier
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
            
            // Petit délai pour montrer l'animation
            setResponseMessage(`Fichier "${files[0].name}" prêt à être envoyé`);
            setResponseStatus('success');
            
            setTimeout(() => {
                setResponseMessage("");
                setResponseStatus(null);
            }, 3000);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
            
            // Feedback visuel
            setResponseMessage(`Fichier "${files[0].name}" sélectionné`);
            setResponseStatus('success');
            
            setTimeout(() => {
                setResponseMessage("");
                setResponseStatus(null);
            }, 3000);
        }
    };

    // Version améliorée du téléchargement avec animation de progression
    const handleUpload = async () => {
        if (!selectedFile || !selectedCollection) return;
        
        setIsUploading(true);
        setShowUploadProgress(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('collection', selectedCollection);
        formData.append('user_id', user.id);
        formData.append('tags', JSON.stringify(tags));

        try {
            // Simuler la progression pour montrer l'animation
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 95) {
                        clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + Math.floor(Math.random() * 10) + 1;
                });
            }, 300);

            // URL différente selon le mode d'envoi
            const endpoint = uploadMode === "zip"
                ? 'http://127.0.0.1:5000/document/add_zip'
                : 'http://127.0.0.1:5000/document/add';

            // Pour le mode ZIP, renommer le champ du fichier
            if (uploadMode === "zip") {
                formData.delete('file');
                formData.append('zip_file', selectedFile);
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            clearInterval(progressInterval);
            setUploadProgress(100);
            
            // Attendre un peu pour montrer la progression à 100%
            await new Promise(resolve => setTimeout(resolve, 500));

            const data = await response.json();
            if (response.ok) {
                setShowUploadProgress(false);
                setShowSuccessModal(true);
                
                // Nettoyer les états
                setFileName("");
                setSelectedFile(null);
                setTags([]);
                
                // Rafraîchir les données
                if (selectedCollectionForList === selectedCollection) {
                    const refreshedDocumentsResponse = await fetch(`http://127.0.0.1:5000/document/get?collection=${selectedCollection}`);
                    if (refreshedDocumentsResponse.ok) {
                        const refreshedDocuments = await refreshedDocumentsResponse.json();
                        setDocuments(refreshedDocuments.documents || []);
                    }
                }
                
                // Rafraîchir les autres données
                await refreshData();
            }
            else {
                setShowUploadProgress(false);
                setResponseMessage(`Erreur: ${data.error}`);
                setResponseStatus('error');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
            setShowUploadProgress(false);
            setResponseMessage("Erreur lors de l'envoi du fichier");
            setResponseStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDocumentClick = (source, collection) => {
        setDocumentToDelete({ source, collection });
        setShowDeleteDocumentConfirmation(true);
    };

    const handleDeleteTagClick = () => {
        setShowDeleteTagConfirmation(true);
    };
    
    const handleDocumentDeleteConfirm = async () => {
        if (!documentToDelete) return;
        
        try {
            const { source, collection } = documentToDelete;
            const params = new URLSearchParams({ source, collection });
            const response = await fetch(`http://127.0.0.1:5000/document/delete?${params.toString()}`, {
                method: "DELETE",
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setResponseMessage("Document supprimé avec succès.");
                setResponseStatus("success");
                
                // Rafraîchir les données
                await refreshData();
            } else {
                setResponseMessage(`Erreur: ${data.error}`);
                setResponseStatus("error");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setResponseMessage("Erreur lors de la suppression.");
            setResponseStatus("error");
        } finally {
            setShowDeleteDocumentConfirmation(false);
            setDocumentToDelete(null);
        }
    };
    
    const handleDocumentDeleteCancel = () => {
        setShowDeleteDocumentConfirmation(false);
        setDocumentToDelete(null);
    };

    const handleTagDeleteConfirm = async () => {
        if (!selectedTag) return;
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/document/delete_by_tag?tag=${encodeURIComponent(selectedTag)}`, {
                    method: "DELETE",
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    setResponseMessage(`Tous les documents avec le tag "${selectedTag}" ont été supprimés.`);
                    setResponseStatus("success");
                    
                    await refreshData();
                } else {
                    setResponseMessage(`Erreur: ${data.error}`);
                    setResponseStatus("error");
                }
        } catch (error) {
            console.error("Erreur réseau :", error);
            setResponseMessage("Erreur lors de la suppression.");
            setResponseStatus("error");
        } finally {
            setShowDeleteTagConfirmation(false);
            setSelectedTag(null);
        }
    };
    
    const handleTagDeleteCancel = () => {
        setShowDeleteTagConfirmation(false);
    };

    // Fonction pour visualiser un PDF
    const handleViewPdf = (source) => {
        // URL de l'API qui sert les fichiers PDF
        const pdfUrl = `http://127.0.0.1:5000/document/download?source=${encodeURIComponent(source)}`;
        
        // Ouvrir le PDF dans un nouvel onglet
        window.open(pdfUrl, "_blank");
    };

    // Fonction utilitaire pour rafraîchir les données
    const refreshData = async () => {
        // Rafraîchir les documents par collection
        if (selectedCollectionForList) {
            const documentsResponse = await fetch(`http://127.0.0.1:5000/document/get?collection=${selectedCollectionForList}`);
            if (documentsResponse.ok) {
                const documentsData = await documentsResponse.json();
                setDocuments(documentsData.documents || []);
            }
        }
        
        // Rafraîchir les documents par tag
        if (selectedTag) {
            const tagDocumentsResponse = await fetch(`http://127.0.0.1:5000/document/get_by_tag?tag=${selectedTag}`);
            if (tagDocumentsResponse.ok) {
                const tagDocumentsData = await tagDocumentsResponse.json();
                setDocumentsByTag(tagDocumentsData.documents || []);
            }
        }
        
        // Rafraîchir la liste des tags
        const tagsResponse = await fetch(`http://127.0.0.1:5000/document/get_tags`);
        if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            setDbTags(tagsData.tags || []);
            
            // Vérifier si le tag sélectionné existe encore
            if (selectedTag && (!tagsData.tags || !tagsData.tags.includes(selectedTag))) {
                setSelectedTag("");
            }
        }
    };

    // Filtrer les documents en fonction du terme de recherche
    const filteredDocuments = documents.filter(doc => 
        doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="flex flex-col space-y-8 max-w-screen-xl h-screen max-h-screen mx-auto p-8 overflow-auto">
            {/* Notification */}
            <NotificationAnimation 
                responseMessage={responseMessage} 
                responseStatus={responseStatus} 
                onClose={closeNotification}
            />
            
            {/* Animations modales */}
            <AnimatePresence>
                {showUploadProgress && (
                    <UploadingAnimation 
                        progress={uploadProgress} 
                        fileName={fileName} 
                    />
                )}
                
                {showSuccessModal && (
                    <SuccessAnimation 
                        onComplete={() => setShowSuccessModal(false)} 
                    />
                )}
                
                {showDeleteDocumentConfirmation && (
                    <DeleteConfirmation 
                        onCancel={handleDocumentDeleteCancel}
                        onConfirm={handleDocumentDeleteConfirm}
                        itemName={documentToDelete?.file_name || "ce document"}
                    />
                )}

                {showDeleteTagConfirmation && (
                    <DeleteConfirmation 
                        onCancel={handleTagDeleteCancel}
                        onConfirm={handleTagDeleteConfirm}
                        itemName={documentToDelete?.file_name || "ce tag et tous les documents associés"}
                    />
                )}
            </AnimatePresence>

            {/* Premier Card - Créer une collection */}
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
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
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
                            </motion.div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deuxième Card - Déposer un document */}
            <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg pb-4">
                    <div className="flex items-center gap-3">
                        <Upload className="h-6 w-6" />
                        <h3 className="text-xl font-semibold">Déposer un document</h3>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            <label htmlFor="tagInput" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tags (Facultatif)
                            </label>
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ajoutez un tag et appuyez sur Entrée"
                                className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white"
                            />
                        </div>                 
                    </div>

                    {/* Afficher les tags avec animation */}
                    {tags.length > 0 && (
                        <div className="mb-4">
                            <motion.h2 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2"
                            >
                                Tags sélectionnés :
                            </motion.h2>
                            <TagAnimations tags={tags} removeTag={removeTag} />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type d'envoi
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="uploadMode"
                                    value="single"
                                    checked={uploadMode === "single"}
                                    onChange={() => setUploadMode("single")}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Document unique</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="uploadMode"
                                    value="zip"
                                    checked={uploadMode === "zip"}
                                    onChange={() => setUploadMode("zip")}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Archive ZIP (plusieurs PDF)</span>
                            </label>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            {uploadMode === "zip"
                                ? "L'archive ZIP doit contenir uniquement des fichiers PDF à traiter."
                                : "Sélectionnez un seul document PDF à la fois."}
                        </div>
                    </div>

                    {/* Zone de dépôt avec animation */}
                    <DropzoneAnimation
                        isDragging={isDragging}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <FileUploadAnimation 
                            fileName={fileName} 
                            onRemove={() => {
                                setFileName("");
                                setSelectedFile(null);
                            }} 
                            fileInputRef={fileInputRef}
                            uploadMode={uploadMode}
                        />
                        <input
                            type="file"
                            accept={uploadMode === "zip" ? ".zip" : ".pdf"}
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </DropzoneAnimation>
                    
                    {/* Bouton d'envoi animé */}
                    <AnimatedUploadButton
                        onClick={handleUpload}
                        disabled={!selectedFile || !selectedCollection || isUploading}
                        isUploading={isUploading}
                        uploadMode={uploadMode}
                    />
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
                                        placeholder="Rechercher un document par son nom"
                                        className="shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
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
                                                    {doc.tags && doc.tags.length > 0 && (
                                                    <div className="flex items-center flex-wrap gap-2 mt-2">
                                                        {doc.tags.map((tag, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full"
                                                        >
                                                            <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                                            <span>{tag}</span>
                                                        </div>
                                                        ))}
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-4">
                                                    <div
                                                        onClick={() => handleViewPdf(doc.source)}
                                                        className="p-2 rounded hover:text-indigo-500 dark:hover:bg-indigo-500/30"
                                                        title="Afficher le PDF"
                                                    >
                                                        <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                                                    </div>
                                                    <div
                                                        onClick={() => handleDeleteDocumentClick(doc.source, doc.collection)}
                                                        className="p-2 rounded hover:text-red-400 dark:hover:bg-red-400/30"
                                                        title="Supprimer le document"
                                                    >
                                                        <Trash2 className="h-5 w-5 text-red-400 dark:text-red-400" />
                                                    </div>
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

            <Card className="shadow-md">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg pb-4">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Tag className="h-6 w-6" />
                        <h3 className="text-xl font-semibold">Gestion des tags</h3>
                    </div>
                    <div className="text-sm">
                        {dbTags.length} tag{dbTags.length !== 1 ? 's' : ''}
                    </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {dbTags.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <Tag className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">Aucun tag trouvé.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                        Les tags apparaîtront automatiquement lorsque des documents seront associés à des tags.
                        </p>
                    </div>
                    ) : (
                    <>
                        <div className="flex flex-wrap gap-3">
                        {dbTags.map((tag) => (
                            <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1 rounded-full text-sm border ${
                                selectedTag === tag
                                ? "bg-red-500 text-white border-red-500"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                            >
                            {tag}
                            </button>
                        ))}
                        </div>

                        {!selectedTag && (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                            Sélectionnez un tag pour voir ses documents.
                            </p>
                        </div>
                        )}
                    </>
                    )}

                    {selectedTag && (
                    <>
                        <div className="flex justify-between items-center mt-4">
                        <h4 className="text-md font-semibold">Documents associés à « {selectedTag} »</h4>
                        <button
                            onClick={handleDeleteTagClick}
                            className="text-sm text-red-500 hover:underline"
                        >
                            Supprimer le tag
                        </button>
                        </div>

                        {documentsByTag.length === 0 ? (
                        <p className="text-gray-500 mt-4">Aucun document trouvé pour ce tag.</p>
                        ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                            {documentsByTag.map((doc, index) => (
                            <div
                                key={index}
                                className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-4">
                                <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {doc.file_name} - {doc.collection}
                                </h4>
                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex items-center flex-wrap gap-2 mt-2">
                                    {doc.tags.map((tag, index) => (
                                        <div
                                        key={index}
                                        className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full"
                                        >
                                        <Tag className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                        <span>{tag}</span>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                </div>
                                <div className="flex gap-4">
                                <div
                                    onClick={() => handleViewPdf(doc.source)}
                                    className="p-2 rounded hover:text-indigo-500 dark:hover:bg-indigo-500/30"
                                    title="Afficher le PDF"
                                >
                                    <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-500" />
                                </div>
                                <div
                                    onClick={() => handleDeleteDocumentClick(doc.source, doc.collection)}
                                    className="p-2 rounded hover:text-red-400 dark:hover:bg-red-400/30"
                                    title="Supprimer le document"
                                >
                                    <Trash2 className="h-5 w-5 text-red-400 dark:text-red-400" />
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default GestionCollections;