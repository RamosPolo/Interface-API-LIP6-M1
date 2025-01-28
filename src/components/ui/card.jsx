import React from 'react';

export const Card = ({ children, className = '' }) => {
    return (
        <div className={`
      bg-white dark:bg-gray-800
      rounded-lg border border-gray-200 dark:border-gray-700
      shadow-sm hover:shadow-md
      transition-shadow duration-200
      ${className}
    `}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`
      px-6 py-4
      border-b border-gray-200 dark:border-gray-700
      ${className}
    `}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`
      px-6 py-4
      ${className}
    `}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`
      px-6 py-4
      border-t border-gray-200 dark:border-gray-700
      ${className}
    `}>
            {children}
        </div>
    );
};