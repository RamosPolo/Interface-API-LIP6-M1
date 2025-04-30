import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MessageCircle, Search, Calendar, User, Bot, ChevronDown, ChevronUp, Clock, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const HistoryItem = ({ query, response, date, expanded, onToggle }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div 
            className="p-4 cursor-pointer bg-white dark:bg-gray-800 flex items-center justify-between"
            onClick={onToggle}
        >
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2">
                    <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{query}</p>
                    <p className="text-xs text-gray-500 mt-1">{date}</p>
                </div>
            </div>
            {expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
        </div>
        
        {expanded && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="mb-4">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="bg-indigo-600 text-white rounded-full p-2 mt-1">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-indigo-600 text-white p-3 rounded-lg shadow-sm">
                            <p className="whitespace-pre-wrap">{query}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-2 mt-1">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-sm">
                            <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">{response}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Exporter
                    </Button>
                </div>
            </div>
        )}
    </div>
);

const FilterBar = ({ searchTerm, onSearchChange, dateFilter, onDateFilterChange }) => (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
        <div className="flex-1">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Rechercher dans l'historique..."
                    className="pl-9 w-full"
                />
            </div>
        </div>
        
        <div className="w-full md:w-48">
            <Select
                value={dateFilter}
                onChange={onDateFilterChange}
                options={[
                    { value: "all", label: "Toutes les dates" },
                    { value: "today", label: "Aujourd'hui" },
                    { value: "week", label: "Cette semaine" },
                    { value: "month", label: "Ce mois" },
                ]}
                className="w-full"
            />
        </div>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Aucun historique trouvé
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Vous n'avez pas encore de conversations enregistrées ou aucun résultat ne correspond à votre recherche.
        </p>
    </div>
);

const History = () => {
    // Exemple de données d'historique
    const [historyItems, setHistoryItems] = useState([
        {
            id: 1,
            query: "Quelle est la capitale de la France ?",
            response: "La capitale de la France est Paris. C'est la plus grande ville du pays et l'une des plus importantes métropoles européennes. Paris est connue pour sa richesse culturelle, ses monuments emblématiques comme la Tour Eiffel, l'Arc de Triomphe et la cathédrale Notre-Dame, ainsi que pour ses musées de renommée mondiale comme le Louvre et le Musée d'Orsay.",
            date: "Aujourd'hui à 14:30",
            collection: "Géographie"
        },
        {
            id: 2,
            query: "Qui a écrit Les Misérables ?",
            response: "Les Misérables a été écrit par Victor Hugo. C'est un roman historique publié en 1862, considéré comme l'un des plus grands romans de la littérature française du XIXe siècle. L'œuvre décrit la vie de personnages issus des couches populaires et défavorisées, évoluant en France dans la première moitié du XIXe siècle. Victor Hugo y aborde des thèmes comme la justice, la politique et l'amour.",
            date: "Aujourd'hui à 14:25",
            collection: "Littérature"
        },
        {
            id: 3,
            query: "Explique-moi les principes fondamentaux du machine learning",
            response: "Le machine learning (apprentissage automatique) est une branche de l'intelligence artificielle qui permet aux systèmes d'apprendre et de s'améliorer à partir de l'expérience sans être explicitement programmés. Voici les principes fondamentaux :\n\n1. Les données : Le ML repose sur des données de qualité et en quantité suffisante pour l'entraînement des modèles.\n\n2. Les algorithmes : Différents types d'algorithmes (régression, classification, clustering, réseaux de neurones) sont utilisés selon la nature du problème à résoudre.\n\n3. L'entraînement : Le modèle apprend à partir des données d'entraînement pour identifier des motifs et des relations.\n\n4. L'évaluation : La performance du modèle est testée sur des données qu'il n'a jamais vues pour évaluer sa capacité de généralisation.\n\n5. Les hyperparamètres : Ce sont des variables configurables qui déterminent la structure du modèle et comment il est entraîné.\n\n6. L'optimisation : Processus d'ajustement des paramètres du modèle pour améliorer ses performances.\n\nCes principes s'appliquent à travers les différentes approches du ML comme l'apprentissage supervisé, non supervisé, et par renforcement.",
            date: "Hier à 10:15",
            collection: "IA"
        }
    ]);
    
    const [expandedItems, setExpandedItems] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    
    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    // Filtrer les éléments d'historique en fonction de la recherche et du filtre de date
    const filteredItems = historyItems.filter(item => {
        const matchesSearch = 
            item.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.response.toLowerCase().includes(searchTerm.toLowerCase());
            
        let matchesDate = true;
        if (dateFilter === "today") {
            matchesDate = item.date.includes("Aujourd'hui");
        } else if (dateFilter === "week") {
            matchesDate = item.date.includes("Aujourd'hui") || item.date.includes("Hier");
        } else if (dateFilter === "month") {
            // Logique simplifiée, dans une vraie application vous auriez une logique de date plus robuste
            matchesDate = true;
        }
        
        return matchesSearch && matchesDate;
    });

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">
                            Historique des conversations
                        </h3>
                    </div>
                </CardHeader>
                
                <CardContent className="p-6">
                    <FilterBar 
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        dateFilter={dateFilter}
                        onDateFilterChange={setDateFilter}
                    />
                    
                    {filteredItems.length > 0 ? (
                        <div className="space-y-2">
                            {filteredItems.map((item) => (
                                <HistoryItem 
                                    key={item.id} 
                                    {...item} 
                                    expanded={!!expandedItems[item.id]}
                                    onToggle={() => toggleExpand(item.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </CardContent>
                
                <CardFooter className="bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700 p-4 rounded-b-lg">
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Affichage de {filteredItems.length} élément{filteredItems.length !== 1 ? 's' : ''} sur {historyItems.length}
                        </p>
                        
                        <Button 
                            variant="outline" 
                            className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
                            size="sm"
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Exporter tout
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default History;