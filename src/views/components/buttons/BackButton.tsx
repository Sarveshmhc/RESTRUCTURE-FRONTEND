import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'home' | 'minimal';
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to = '/home', 
  label = 'Back to Home',
  variant = 'default',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  const baseClasses = "inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium";
  
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600",
    home: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800",
    minimal: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {variant === 'home' ? (
        <Home className="w-4 h-4" />
      ) : (
        <ArrowLeft className="w-4 h-4" />
      )}
      {variant !== 'minimal' && <span>{label}</span>}
    </motion.button>
  );
};

export default BackButton;
