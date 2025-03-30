import React from "react";

export const Select = ({ value, onChange, options, className = "" }) => {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`
                    w-full
                    rounded-md
                    border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-900
                    px-4 py-2
                    text-gray-900 dark:text-gray-100
                    focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${className}
                `}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};