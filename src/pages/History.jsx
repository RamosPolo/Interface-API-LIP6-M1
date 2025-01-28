import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const HistoryItem = ({ query, response, date }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 py-4">
        <div className="flex items-start gap-4 mb-3">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{query}</p>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{response}</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{date}</p>
    </div>
);

const History = () => {
    // Exemple de données d'historique
    const historyItems = [
        {
            query: "Quelle est la capitale de la France ?",
            response: "La capitale de la France est Paris.",
            date: "Aujourd'hui à 14:30"
        },
        {
            query: "Qui a écrit Les Misérables ?",
            response: "Les Misérables a été écrit par Victor Hugo.",
            date: "Aujourd'hui à 14:25"
        }
    ];

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center gap-4">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Historique des conversations
                </h3>
            </CardHeader>
            <CardContent>
                {historyItems.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {historyItems.map((item, index) => (
                            <HistoryItem key={index} {...item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            Aucun historique disponible
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default History;