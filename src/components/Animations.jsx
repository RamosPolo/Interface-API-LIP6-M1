// Animations.jsx - Tous les composants d'animation pour RAG Assistant
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Check, 
  AlertCircle, 
  FileText, 
  Upload, 
  Trash2, 
  Zap 
} from "lucide-react";

/****************************
 * Animations pour le chat
 ****************************/

// Animation du texte lettre par lettre
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
    exclamation: 500, // !
    newline: 400     // \n
  };

  // Fonction pour déterminer la durée de pause en fonction du caractère
  const getPauseDuration = useCallback((char) => {
    switch (char) {
      case ',': return pauseDuration.comma;
      case ';': return pauseDuration.semicolon;
      case '.': return pauseDuration.period;
      case '?': return pauseDuration.question;
      case '!': return pauseDuration.exclamation;
      case '\n': return pauseDuration.newline;
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

// Animation du robot qui réfléchit
const ThinkingAnimation = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-8 px-4"
      >
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center">
          <div className="mr-4 relative">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
              animate={{ 
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Bot className="h-8 w-8 text-white" />
              
              {/* Effet de pulsation pour simuler le "cerveau" qui travaille */}
              <motion.div 
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              
              {/* Cercles d'énergie qui émanent du robot */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-indigo-400 rounded-full"
                  initial={{ scale: 0.5, opacity: 0.7 }}
                  animate={{
                    scale: [0.5, 1.5],
                    opacity: [0.7, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.5
                  }}
                />
              ))}
            </motion.div>
            
            {/* Petits éclairs autour du robot */}
            <motion.div
              className="absolute -top-1 -right-1 text-yellow-500"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Zap size={12} />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-1 -left-1 text-yellow-500"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            >
              <Zap size={12} />
            </motion.div>
          </div>
          
          <div className="flex-1">
            <motion.p 
              className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2"
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              Je réfléchis à votre demande...
            </motion.p>
            
            <motion.p className="text-sm text-gray-600 dark:text-gray-400">
              Analyse et traitement des informations en cours. <br />
              Préparation d'une réponse pertinente.
            </motion.p>
            
            <div className="flex space-x-2 mt-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: i * 0.15
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Indicateur de frappe pour le chat
const TypeIndicator = ({ isTyping }) => (
  <AnimatePresence>
    {isTyping && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 10 }}
        className="flex items-center text-gray-500 dark:text-gray-400 text-sm py-2 px-4"
      >
        <div className="flex space-x-1 items-center">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="ml-2">Assistant est en train d'écrire...</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// Menu contextuel pour les messages
const MessageActions = ({ onCopy, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute -bottom-5 right-2 flex gap-3 z-20"
    >
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCopy}
        className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title="Copier"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

/****************************
 * Animations pour les tags
 ****************************/

// Animation pour l'ajout de tags
const TagAnimations = ({ tags, removeTag }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {tags.map((tag) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={() => removeTag(tag)}
            className="flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-400 text-indigo-700 dark:text-indigo-100 text-sm rounded-full transition-colors hover:bg-indigo-200 dark:hover:bg-indigo-500 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <p>{tag}</p>
            <motion.p 
              className="text-base leading-none flex items-center justify-center w-4 h-4"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >x</motion.p>
          </motion.div>                           
        ))}
      </AnimatePresence>
    </div>
  );
};

/****************************
 * Animations pour les documents
 ****************************/

// Animation pour le message de notification
const NotificationAnimation = ({ responseMessage, responseStatus, onClose }) => {
  useEffect(() => {
    if (!responseMessage) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [responseMessage, onClose]);

  return (
    <AnimatePresence>
      {responseMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -50, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-indigo-600 text-white"
        >
          <motion.div 
            className="p-1 bg-white/20 rounded-full"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.2 }}
          >
            {responseStatus === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </motion.div>
          <div>
            <div className="text-sm font-medium">
              {responseStatus === 'success' ? 'Succès' : 'Erreur'}
            </div>
            <div className="text-xs text-white/80">{responseMessage}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animation du fichier déposé/sélectionné
const FileUploadAnimation = ({ fileName, onRemove, fileInputRef, uploadMode }) => {
  return (
    <AnimatePresence mode="wait">
      {fileName ? (
        <motion.div 
          key="file-selected"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex items-center bg-indigo-100 dark:bg-indigo-900/50 px-4 py-2 rounded-lg mb-2"
          >
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="font-medium text-indigo-700 dark:text-indigo-300 truncate max-w-xs">{fileName}</span>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-red-500 hover:text-red-600 flex items-center text-sm font-medium"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Supprimer
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          key="no-file"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center font-medium">
            Glissez et déposez un fichier ici
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4 text-center">
            ou cliquez pour en sélectionner un
          </p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(238, 242, 255, 0.9)" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50"
            onClick={() => fileInputRef.current.click()}
          >
            {uploadMode === "zip"
                ? "Sélectionner une archive ZIP"
                : "Sélectionner un document PDF"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Animation du dropzone
const DropzoneAnimation = ({ isDragging, children, onDragOver, onDragLeave, onDrop }) => {
  return (
    <motion.div
      initial={{ borderColor: "rgba(209, 213, 219, 0.5)" }}
      animate={{ 
        borderColor: isDragging 
          ? "rgba(99, 102, 241, 0.8)" 
          : "rgba(209, 213, 219, 0.5)",
        backgroundColor: isDragging
          ? "rgba(238, 242, 255, 0.3)"
          : "transparent"
      }}
      transition={{ duration: 0.2 }}
      className={`
        border-2 border-dashed rounded-lg
        p-10 flex flex-col items-center justify-center
        transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <motion.div 
        initial={{ y: 0 }}
        animate={{ 
          y: isDragging ? [-5, 0, -5] : 0
        }}
        transition={{ 
          repeat: isDragging ? Infinity : 0, 
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="mb-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-4"
      >
        <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      {children}
    </motion.div>
  );
};

// Animation de succès lors de l'ajout d'un document
const SuccessAnimation = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 h-full w-full flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div 
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0.5 }}
          animate={{ 
            scale: [0.5, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 0.6,
            times: [0, 0.6, 0.8, 1]
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            <Check className="w-10 h-10 text-green-600 dark:text-green-500" />
          </motion.div>
        </motion.div>

        <motion.h3
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Document ajouté avec succès !
        </motion.h3>

        <motion.p
          className="text-gray-600 dark:text-gray-300 text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Votre document a été ajouté à la collection et est prêt à être utilisé.
        </motion.p>

        <motion.button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Continuer
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Animation pour la suppression de document
const DeleteConfirmation = ({ onCancel, onConfirm, itemName = "ce document" }) => {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirmer la suppression</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Êtes-vous sûr de vouloir supprimer {itemName} ? Cette action ne peut pas être annulée.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <motion.button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Annuler
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Supprimer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Animation de chargement pendant l'envoi du document
const UploadingAnimation = ({ progress = 0, fileName }) => {
  return (
    <motion.div 
      className="fixed inset-0 h-full w-full flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="flex items-center mb-4">
          <motion.div 
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-4"
            animate={{ 
              rotate: [0, 360],
              borderRadius: ["50%", "30%", "50%"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <svg 
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
                />
              </svg>
            </motion.div>
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Envoi en cours</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {fileName ? `Envoi de "${fileName}"` : "Envoi de votre document"}
            </p>
          </div>
        </div>

        <div className="mt-5 mb-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1 overflow-hidden">
            <motion.div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{progress}% terminé</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {progress < 100 ? "Traitement en cours..." : "Finalisation..."}
            </motion.span>
          </div>
        </div>
        
        <motion.p
          className="text-xs text-gray-500 dark:text-gray-400 text-center mt-5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Veuillez patienter pendant le traitement de votre document
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

/*****************************
 * Animation de bienvenue
 *****************************/

const WelcomeMessage = ({ onComplete }) => {
  const [showMessage, setShowMessage] = useState(true);
  
  useEffect(() => {
    // Durée plus longue pour permettre de lire le message
    const timer = setTimeout(() => {
      setShowMessage(false);
      onComplete();
    }, 8000); // 8 secondes
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!showMessage) return null;
  
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Pattern décoratif en arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      
      <motion.div 
        className="text-center px-8 max-w-2xl relative z-10"
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: -20, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 0.2
        }}
      >
        <div className="relative">
          <motion.div 
            className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl"
            animate={{ 
              y: [0, -15, 0],
              rotateZ: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 3, 
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Infinity
            }}
          >
            <Bot className="h-14 w-14 text-white" />
            
            {/* Effet de pulsation amélioré autour du robot */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-indigo-400/70 rounded-2xl"
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{
                  scale: [0.6, 1.2],
                  opacity: [0.6, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.5
                }}
              />
            ))}
            
            {/* Brillance supplémentaire pour effet de profondeur */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Bonjour !
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-900 dark:text-white mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Comment puis-je vous aider aujourd'hui ?
        </motion.p>
        
        <motion.p
          className="text-base text-gray-800 dark:text-gray-200 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          Je peux rechercher des informations dans vos documents, répondre à vos questions
          et vous aider à analyser vos données.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.button 
            onClick={() => {
              setShowMessage(false);
              onComplete();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Commencer
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/*****************************
 * États vides améliorés
 *****************************/

// État vide avec animation
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
    <motion.div 
      className="mb-6 w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center"
      animate={{ 
        y: [0, -10, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{ 
        repeat: Infinity,
        duration: 3
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </motion.div>
    <motion.h3 
      className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      Comment puis-je vous aider aujourd'hui ?
    </motion.h3>
    <motion.p 
      className="text-gray-500 dark:text-gray-400 max-w-md mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      Posez une question ou demandez-moi d'effectuer une recherche dans votre base documentaire.
    </motion.p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
      {[
        { title: "Rechercher un document", desc: "Quelles informations contient le document X sur le sujet Y ?" },
        { title: "Analyser des données", desc: "Peux-tu résumer les points clés du document sur Z ?" },
        { title: "Obtenir des explications", desc: "Explique-moi le concept de X mentionné dans mes documents." },
        { title: "Comparer des informations", desc: "Quelles sont les différences entre X et Y selon mes documents ?" }
      ].map((suggestion, idx) => (
        <motion.button 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx + 0.7, duration: 0.5 }}
          className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{suggestion.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.desc}</p>
        </motion.button>
      ))}
    </div>
  </div>
);

// Exportation unique de tous les composants
export {
  // Animations pour le chat
  TypingAnimation,
  ThinkingAnimation,
  TypeIndicator,
  MessageActions,
  WelcomeMessage,
  EmptyState,
  
  // Animations pour les tags
  TagAnimations,
  
  // Animations pour les documents
  NotificationAnimation,
  FileUploadAnimation,
  DropzoneAnimation,
  SuccessAnimation,
  DeleteConfirmation,
  UploadingAnimation,
};