// button.jsx - Composant Button amélioré
import React from 'react';

export const Button = ({ 
    children, 
    onClick, 
    className = '', 
    variant = 'primary', 
    size = 'md',
    disabled = false,
    type = 'button',
    ...props 
}) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
        secondary: 'bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-gray-700',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200',
        destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
        outline: 'bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200',
        link: 'bg-transparent text-indigo-600 dark:text-indigo-400 hover:underline p-0 h-auto',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-md',
        md: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-5 py-2.5 text-base rounded-md',
        icon: 'p-2 rounded-full aspect-square',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${variants[variant]} 
                ${sizes[size]}
                ${className}
                inline-flex items-center justify-center
                font-medium
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:pointer-events-none
                transition-all duration-200
            `}
            {...props}
        >
            {children}
        </button>
    );
};

// card.jsx - Composants Card améliorés
export const Card = ({ children, className = '' }) => {
    return (
        <div className={`
            bg-white dark:bg-gray-800
            rounded-lg border border-gray-200 dark:border-gray-700
            shadow-sm
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

// input.jsx - Composant Input amélioré
export const Input = ({
    value,
    onChange,
    placeholder,
    className = '',
    type = 'text',
    error,
    disabled = false,
    required = false,
    ...props
}) => {
    return (
        <div className="relative w-full">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`
                    w-full
                    rounded-md
                    border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    px-4 py-2
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 focus:border-indigo-600 focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

// textarea.jsx - Composant Textarea amélioré
export const Textarea = ({
    value,
    onChange,
    placeholder,
    className = '',
    error,
    disabled = false,
    required = false,
    rows = 4,
    ...props
}) => {
    return (
        <div className="relative w-full">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className={`
                    w-full
                    rounded-md
                    border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    px-4 py-2
                    text-gray-900 dark:text-gray-100
                    placeholder:text-gray-500 dark:placeholder:text-gray-400
                    focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 focus:border-indigo-600 focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};

// select.jsx - Composant Select amélioré
export const Select = ({ 
    value, 
    onChange, 
    options = [],
    placeholder,
    className = '',
    disabled = false,
    required = false,
    error,
    ...props
}) => {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
                className={`
                    appearance-none
                    w-full
                    rounded-md
                    border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-800
                    px-4 py-2 pr-8
                    text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 focus:border-indigo-600 focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors duration-200
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    ${className}
                `}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};