import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';

export const CartSummary: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch settings when component mounts to ensure proper total calculation
    useSettingsStore.getState().fetchSettings();
  }, []);

  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [items.length, navigate]);

  const getOptionTitle = (optionId: string) => {
    return settings?.productOptions.find(opt => opt.id === optionId)?.title;
  };

  const getItemTotal = (item: typeof items[0]) => {
    const basePrice = item.product.price * item.quantity;
    const optionPrice = item.selectedOption
      ? (settings?.productOptions.find(opt => opt.id === item.selectedOption)?.price || 0) * item.quantity
      : 0;
    return basePrice + optionPrice;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {items.map((item) => (
          <div key={`${item.product.id}-${item.selectedOption || 'no-option'}`} className="flex justify-between mb-3 pb-3 border-b">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-600">£{item.product.price.toFixed(2)} each</p>
              </div>
              {item.selectedOption && (
                <p className="text-sm text-gray-600">
                  {getOptionTitle(item.selectedOption)} 
                  (+£{settings?.productOptions.find(opt => opt.id === item.selectedOption)?.price.toFixed(2)})
                </p>
              )}
              <div className="flex items-center mt-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.selectedOption, Math.max(item.quantity - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="mx-3 min-w-[2rem] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.selectedOption, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <p className="font-medium">£{getItemTotal(item).toFixed(2)}</p>
              <button
                onClick={() => removeItem(item.product.id, item.selectedOption)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>£{getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/menu')}
          className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/collection-time')}
          className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Select Collection Time
        </button>
      </div>
    </div>
  );
};

export default CartSummary;