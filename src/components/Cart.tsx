import React from 'react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  
  const totalItems = React.useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95 duration-150"
      aria-label={`View Cart (${totalItems} items)`}
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {totalItems}
        </span>
      </div>
    </button>
  );
};