import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AddDocuments = () => {
    return (
        <Card className="flex-1">
            <CardContent>
                <h3 className="text-xl font-bold mb-4">Déposer des documents</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                    <p className="mb-4 text-gray-600">Glissez et déposez un fichier ZIP ici, ou cliquez pour en sélectionner un.</p>
                    <input
                        type="file"
                        accept=".zip"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => console.log(e.target.files)}
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                        Sélectionner un fichier
                    </label>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddDocuments;
