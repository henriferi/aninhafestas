import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'pink' | 'purple' | 'blue' | 'green' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'pink' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 border-2';
      case 'md':
        return 'w-6 h-6 border-2';
      case 'lg':
        return 'w-8 h-8 border-3';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'pink':
        return 'border-pink-200 border-t-pink-500';
      case 'purple':
        return 'border-purple-200 border-t-purple-500';
      case 'blue':
        return 'border-blue-200 border-t-blue-500';
      case 'green':
        return 'border-green-200 border-t-green-500';
      case 'gray':
        return 'border-gray-200 border-t-gray-500';
    }
  };

  return (
    <div 
      className={`
        ${getSizeClasses()} 
        ${getColorClasses()} 
        rounded-full animate-spin
      `}
    />
  );
};

export default LoadingSpinner;