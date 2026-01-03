import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary';
  children: ReactNode;
  isLoading?: boolean;
}

export const Button = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  isLoading,
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};
