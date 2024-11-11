import React from 'react';
import { useProductStore } from '../store/productStore';

export const NetworkStatus: React.FC = () => {
  const { isOffline, error, toggleNetwork } = useProductStore();

  if (!isOffline && !error) return null;

  return (
    <div className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-lg shadow-lg ${
      isOffline ? 'bg-yellow-50' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-sm font-medium">
            {isOffline ? 'Offline Mode' : 'Online'}
          </span>
        </div>
        <button
          onClick={() => toggleNetwork()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isOffline ? 'Try to reconnect' : 'Work offline'}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-gray-600">{error}</p>
      )}
    </div>
  );
};