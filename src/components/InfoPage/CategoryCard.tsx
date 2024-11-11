import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, image }) => {
  return (
    <Link 
      to={`/category/${title.toLowerCase()}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
    >
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${image})` }} 
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};