import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Home = ({ query, setQuery, handleQuerySubmit, response, submitted }) => {
    return (
        <>
            <Card className="mb-4">
                <CardContent>
                    <Textarea
                        placeholder="Posez une question..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="mb-4"
                    />
                    <Button onClick={handleQuerySubmit}>Envoyer</Button>
                </CardContent>
            </Card>
            {submitted && (
                <Card className="flex-1">
                    <CardContent>
                        <h3 className="text-xl font-bold mb-2">Réponse :</h3>
                        <p>{response}</p>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default Home;
