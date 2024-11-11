import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/van.jpg';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = React.useState(false);

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920")',
      }}
    >
      <div className="text-center text-white">
        {!imageError && (
          <img 
            src={logo}
            alt="Some Good Cuppa Logo"
            className="w-32 h-32 mx-auto mb-6"
            onError={() => setImageError(true)}
          />
        )}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-wider">
          Some Good Cuppa<br />
          <span className="text-4xl md:text-6xl block mt-4">Mobile Coffee Experience</span>
        </h1>
        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-3 bg-white text-gray-900 rounded-lg text-xl font-semibold 
                   hover:bg-gray-100 transition-colors duration-300 
                   transform hover:scale-105 active:scale-95"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default LandingPage;