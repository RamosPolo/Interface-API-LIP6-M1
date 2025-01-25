import React from 'react';

export const Button = ({ children, onClick, className, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-blue-500 text-white',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    };

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
