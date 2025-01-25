import React from 'react';

export const Input = ({ value, onChange, placeholder, className }) => {
    return (
        <input
            type="text\"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border rounded-xl ${className}`}
    />
);
};
