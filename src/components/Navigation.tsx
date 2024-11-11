import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Category } from '../types';

interface NavigationProps {
  categories: Category[];
  isMenuOpen: boolean;
  onMenuItemClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  categories, 
  isMenuOpen, 
  onMenuItemClick 
}) => {
  const location = useLocation();

  const isActiveCategory = (category: string) => {
    const currentPath = location.pathname.toLowerCase();
    const categoryPath = `/category/${category.toLowerCase()}`;
    return currentPath === categoryPath;
  };

  const getCategoryPath = (category: string) => {
    // Keep the original casing for display but use lowercase for the URL
    return `/category/${category.toLowerCase()}`;
  };

  return (
    <nav className={`mt-6 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0">
        {categories.map(category => (
          <Link
            key={category}
            to={getCategoryPath(category)}
            className={`
              relative
              px-8 py-4
              rounded-xl
              text-center 
              font-semibold
              text-lg
              transform transition-all duration-200
              shadow-md hover:shadow-lg
              border-2
              ${isActiveCategory(category)
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 hover:from-blue-700 hover:to-blue-800 hover:border-blue-700 scale-105 -translate-y-0.5'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 hover:-translate-y-0.5'
              }
              before:absolute before:inset-0 before:rounded-xl before:transition-opacity before:duration-200
              ${isActiveCategory(category)
                ? 'before:bg-blue-400 before:opacity-0 hover:before:opacity-10'
                : 'before:bg-blue-100 before:opacity-0 hover:before:opacity-50'
              }
            `}
            onClick={onMenuItemClick}
          >
            <span className="relative z-10">{category}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};