import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

const AddDocuments = () => {
    const [inputValue, setInputValue] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const handlePostRequest = async () => {
        if (!inputValue.trim()) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/collection/${encodeURIComponent(inputValue)}`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la requête");
            }

            const data = await response.json();
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
            console.log("Fichier déposé:", files[0]);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
            console.log("Fichier sélectionné:", files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://127.0.0.1:5000/add_document', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Document ajouté avec succès");
            } else {
                alert(`Erreur: ${data.error}`);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
            alert("Erreur lors de l'envoi du fichier");
        }
    };

    return (

        <div className="flex flex-col items-center space-y-6 p-6">
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
                <CardContent>
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
                                Glissez et déposez un fichier ZIP ici,<br />ou cliquez pour en sélectionner un
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
                    <Button
                      onClick={handleUpload}
                      className="w-full mt-4"
                      disabled={!selectedFile}
                    >
                    Envoyer le fichier
                  </Button>
                </CardContent>
            </Card>
        </div>

    );
};

export default AddDocuments;