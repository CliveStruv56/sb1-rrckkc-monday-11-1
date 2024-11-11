import React from 'react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>('');
  const [showAddedMessage, setShowAddedMessage] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { settings } = useSettingsStore();

  // Fetch settings when component mounts
  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  const availableOptions = React.useMemo(() => {
    if (!settings || !product.availableOptions) return [];
    return settings.productOptions.filter(option => 
      product.availableOptions?.includes(option.id)
    );
  }, [product.availableOptions, settings]);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      selectedOption: selectedOptionId || undefined
    });
    
    // Show the added message
    setShowAddedMessage(true);
    
    // Hide the message after 2 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  const selectedOption = availableOptions.find(opt => opt.id === selectedOptionId);
  const totalPrice = product.price + (selectedOption?.price || 0);
  const hasOptions = availableOptions && availableOptions.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-3 flex flex-col h-full relative">
      {showAddedMessage && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-fade-in-out z-10">
          Added to cart!
        </div>
      )}
      
      <div className="relative w-full h-[150px] mb-2">
        <img 
          src={product.image} 
          alt={product.name}
          width={200}
          height={150} 
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="text-sm font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto space-y-2">
          <p className="text-sm font-bold">
            £{totalPrice.toFixed(2)}
            {selectedOption && (
              <span className="text-xs font-normal text-gray-600 ml-1">
                (Base: £{product.price.toFixed(2)} + {selectedOption.title}: £{selectedOption.price.toFixed(2)})
              </span>
            )}
          </p>

          {hasOptions && (
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-blue-700">
                Select Size/Options:
              </label>
              <select
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(e.target.value)}
                className="w-full p-2 text-sm border-2 border-blue-100 rounded bg-blue-50 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Choose an option</option>
                {availableOptions.map((option) => (
                  <option key={option.id} value={option.id} className="font-medium">
                    {option.title} (+£{option.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-2 px-2 rounded text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};