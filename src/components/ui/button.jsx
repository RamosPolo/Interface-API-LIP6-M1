import React from 'react';

export const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
        secondary: 'bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
        text: 'bg-transparent text-indigo-600 dark:text-indigo-400 hover:underline p-0',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variants[variant]}
        ${className}
        inline-flex items-center justify-center
        rounded-md text-sm font-semibold
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
        >
            {children}
        </button>
    );
};