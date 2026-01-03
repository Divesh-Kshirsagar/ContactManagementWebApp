import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'Work' | 'Family' | 'Friends' | 'Other' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variantStyles = {
    Work: 'bg-blue-100 text-blue-800 border-blue-200',
    Family: 'bg-pink-100 text-pink-800 border-pink-200',
    Friends: 'bg-green-100 text-green-800 border-green-200',
    Other: 'bg-gray-100 text-gray-800 border-gray-200',
    default: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
