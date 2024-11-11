import React from 'react';
import { CategoryCard } from './InfoPage/CategoryCard';
import { LocationMap } from './InfoPage/LocationMap';
import { HeroSection } from './InfoPage/HeroSection';

// Image URLs for categories
const IMAGES = {
  coffee: 'https://drive.google.com/thumbnail?id=101Byihs1nIvKiqMwkv6GL2u99WGPAcPA',
  tea: 'https://drive.google.com/thumbnail?id=102Te0kKx-G2nHEM4zQaS4f5qv3OkNOwD',
  cake: 'https://drive.google.com/thumbnail?id=1-yLIUH02DFJ7ewyACPNgv9spxcPjSrWi',
  hotChocolate: 'https://drive.google.com/thumbnail?id=106Hkjvu-EtSs-eCGqfPZ5UTuHZyfFk-8',
  van: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1920'
};

const categories = [
  {
    title: 'Coffees',
    description: 'Expertly crafted coffee drinks made with locally roasted beans',
    image: IMAGES.coffee
  },
  {
    title: 'Teas',
    description: 'A selection of fine teas from around the world',
    image: IMAGES.tea
  },
  {
    title: 'Cakes',
    description: 'Freshly baked cakes and pastries to complement your drink',
    image: IMAGES.cake
  },
  {
    title: 'Hot Chocolate',
    description: 'Rich and creamy hot chocolate made with premium cocoa',
    image: IMAGES.hotChocolate
  }
];

const InfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection image={IMAGES.van} />

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Welcome to A Good Cuppa</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're passionate about bringing the finest coffee experience right to your neighborhood.
            Our mobile coffee van serves up delicious drinks and treats, made with care using premium ingredients.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>

        {/* Location Section */}
        <LocationMap />
      </div>
    </div>
  );
};

export default InfoPage;