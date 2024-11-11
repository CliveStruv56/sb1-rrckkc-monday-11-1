import React from 'react';

interface HeroSectionProps {
  image: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ image }) => {
  return (
    <div 
      className="relative h-[400px] bg-cover bg-center" 
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: 'center 80%'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our Mobile Coffee Experience
          </h1>
          <p className="text-xl md:text-2xl">
            Bringing quality coffees, teas and cakes to Orkney
          </p>
        </div>
      </div>
    </div>
  );
};