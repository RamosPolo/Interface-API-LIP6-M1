import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const TypingAnimation = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);
  const timeoutRef = useRef(null);

  // Configuration des vitesses
  const baseSpeed = 30; // Vitesse de base en ms
  const speedVariation = 20; // Légère variation aléatoire pour un effet plus naturel
  const pauseDuration = {
    comma: 200,      // ,
    semicolon: 300,  // ;
    period: 500,     // .
    question: 500,   // ?
    exclamation: 500 // !
    // Ajoutez d'autres pauses pour d'autres caractères si nécessaire
  };

  // Fonction pour déterminer la durée de pause en fonction du caractère
  const getPauseDuration = useCallback((char) => {
    switch (char) {
      case ',': return pauseDuration.comma;
      case ';': return pauseDuration.semicolon;
      case '.': return pauseDuration.period;
      case '?': return pauseDuration.question;
      case '!': return pauseDuration.exclamation;
      case '\n': return pauseDuration.period; // Pause aux retours à la ligne
      default: return 0;
    }
  }, []);

  // Déterminer si on doit faire une pause
  const shouldPause = useCallback((char) => {
    return getPauseDuration(char) > 0;
  }, [getPauseDuration]);

  // Calculer un temps de frappe légèrement aléatoire pour un effet plus naturel
  const getTypingSpeed = useCallback(() => {
    return baseSpeed + Math.floor(Math.random() * speedVariation) - speedVariation / 2;
  }, []);

  // Réinitialiser l'animation quand le texte change
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsPaused(false);
    setIsBlinking(true);
  }, [text]);

  // Effet principal pour l'animation de frappe
  useEffect(() => {
    if (!text) return;

    // Si l'affichage est terminé
    if (currentIndex >= text.length) {
      if (onComplete) {
        const completeTimer = setTimeout(() => {
          setIsBlinking(false);
          onComplete();
        }, 300);
        return () => clearTimeout(completeTimer);
      }
      return;
    }

    // Gestion des pauses pour la ponctuation
    if (isPaused) {
      const currentChar = text[currentIndex - 1] || '';
      const pauseTime = getPauseDuration(currentChar);
      
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, pauseTime);
      
      return () => clearTimeout(timeoutRef.current);
    }

    // Affichage normal caractère par caractère
    const currentChar = text[currentIndex];
    const nextChar = text[currentIndex + 1] || '';
    
    const typeNextChar = () => {
      setDisplayedText(prev => prev + currentChar);
      setCurrentIndex(prev => prev + 1);
      
      // Si le caractère suivant est une ponctuation, on fait une pause
      if (shouldPause(nextChar)) {
        setIsPaused(true);
      }
    };
    
    timeoutRef.current = setTimeout(typeNextChar, getTypingSpeed());
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, text, isPaused, shouldPause, getPauseDuration, getTypingSpeed, onComplete]);

  return (
    <div className="relative inline">
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {isBlinking && (
        <motion.span
          className="inline-block w-2 h-4 ml-0.5 bg-gray-800 dark:bg-gray-300"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.8 
          }}
        />
      )}
    </div>
  );
};

export default TypingAnimation;