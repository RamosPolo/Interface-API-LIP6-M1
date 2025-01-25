import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const History = () => {
    return (
        <Card className="flex-1">
            <CardContent>
                <h3 className="text-xl font-bold mb-4">Historique</h3>
                <p>Affichage de l'historique des interactions.</p>
            </CardContent>
        </Card>
    );
};

export default History;
