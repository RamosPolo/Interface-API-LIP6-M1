import React from 'react';

export const Input = ({
                          value,
                          onChange,
                          placeholder,
                          className = '',
                          type = 'text',
                          error,
                          disabled = false,
                          required = false,
                      }) => {
    return (
        <div className="relative">
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
          bg-white dark:bg-gray-900
          px-4 py-2
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-500 dark:placeholder:text-gray-400
          focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
};