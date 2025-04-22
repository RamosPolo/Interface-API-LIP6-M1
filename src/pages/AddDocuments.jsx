import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Select } from "@/components/ui/select";

const AddDocuments = () => {
    const [inputValue, setInputValue] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedCollectionForList, setSelectedCollectionForList] = useState("");
    const [tag, setTag] = useState("");
    const [documents, setDocuments] = useState([]);
    const fileInputRef = React.useRef(null);
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
        } catch (error) {
            setResponseMessage(`Erreur: ${error.message}`);
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
                alert("Document ajouté avec succès");
                setFileName("");
                setSelectedFile(null);
                setTag("");

                if (selectedCollectionForList === selectedCollection) {
                    const refreshed = await fetch(`http://127.0.0.1:5000/document/get?collection=${selectedCollection}`);
                    const refreshedData = await refreshed.json();
                    if (refreshed.ok) {
                        setDocuments(refreshedData.documents || []);
                    }
                }
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
            alert("Erreur lors de l'envoi du fichier");
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 max-w-screen-lg mx-auto overflow-auto">
            <Card className="w-full max-w-2xl p-6">
                <CardHeader>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                        Créer une collection
                    </h3>
                </CardHeader>
                <CardContent className="flex items-center gap-4 w-full">
                    <div className="flex-grow">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Entrez le nom de la collection..."
                            className="w-full"
                        />
                    </div>
                    <Button onClick={handlePostRequest} disabled={!inputValue.trim()}>
                        Créer la collection
                    </Button>
                </CardContent>
                {responseMessage && (
                    <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
                        {responseMessage}
                    </div>
                )}
            </Card>
            <Card className="w-full max-w-2xl p-6">
                <CardHeader>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                        Déposer des documents
                    </h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-lg
                            p-12 flex flex-col items-center justify-center
                            transition-colors duration-200
                            ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700'}
                        `}
                    >
                        <Upload className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600" />
                        {fileName ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                                Fichier sélectionné : {fileName}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                                Glissez et déposez un fichier ici,<br />ou cliquez pour en sélectionner un
                            </p>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.zip"
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        
                        <Button variant="secondary" onClick={() => fileInputRef.current.click()}>
                            Sélectionner un fichier
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="collectionSelect" className="text-sm text-white">
                                Sélectionnez une collection
                            </label>
                            <Select
                                value={selectedCollection}
                                onChange={setSelectedCollection}
                                options={collections.map((collection) => ({
                                    value: collection,
                                    label: collection
                                }))}
                            />
                        </div>
                        <div className="flex flex-col w-full gap-2">
                            <label htmlFor="tag" className="text-sm text-white">
                                Tag (facultatif)
                            </label>
                            <Input
                                id="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                placeholder="Entrez un tag (facultatif)"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleUpload}
                        className="w-full mt-4"
                        disabled={!selectedFile || !selectedCollection}
                    >
                        Envoyer le fichier
                    </Button>
                </CardContent>
            </Card>                        
            <Card className="w-full max-w-2xl p-6">
                <CardHeader>
                    <h3 className="text-2xl font-semibold text-center">Liste des documents</h3>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="mb-2">
                        <Select
                            value={selectedCollectionForList}
                            onChange={setSelectedCollectionForList}
                            options={collections.map((c) => ({ value: c, label: c }))}
                            placeholder="Sélectionner une collection"
                        />
                    </div>

                    {selectedCollectionForList ? (
                        documents.length > 0 ? (
                            documents.map((doc, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                    <p className="font-medium">{doc.file_name}</p>
                                    {doc.tag && <p className="text-sm text-gray-500 italic">Tag : {doc.tag}</p>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">Aucun document trouvé.</p>
                        )
                    ) : (
                        <p className="text-gray-500 text-center">Sélectionnez une collection pour voir ses documents.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AddDocuments;
