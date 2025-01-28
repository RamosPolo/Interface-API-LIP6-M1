import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AddDocuments = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");

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
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
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
            p-12
            flex flex-col items-center justify-center
            transition-colors duration-200
            ${isDragging
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-300 dark:border-gray-700'
                    }
          `}
                >
                    <Upload
                        className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-600"
                    />
                    {fileName ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Fichier sélectionné : {fileName}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                            Glissez et déposez un fichier ZIP ici,<br />ou cliquez pour en sélectionner un
                        </p>
                    )}
                    <input
                        type="file"
                        accept=".zip"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload">
                        <Button variant="secondary">
                            Sélectionner un fichier
                        </Button>
                    </label>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddDocuments;