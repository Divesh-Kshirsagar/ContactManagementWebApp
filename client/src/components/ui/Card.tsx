import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md' 
}: CardProps) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyle = hover 
    ? 'hover:shadow-lg hover:border-indigo-200 transition-all duration-200' 
    : '';

  return (
    <div 
      className={`bg-white rounded-xl shadow-md border border-gray-100 ${paddingStyles[padding]} ${hoverStyle} ${className}`}
    >
      {children}
    </div>
  );
};
