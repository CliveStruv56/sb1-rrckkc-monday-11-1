import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TimeSelection } from './TimeSelection';
import { useCartStore } from '../store/cartStore';

const TimeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, setCollectionTime } = useCartStore();
  const [selectedDateTime, setSelectedDateTime] = React.useState<{ date: Date; time: string } | null>(null);

  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  const handleTimeConfirm = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
    setCollectionTime(date, time);
    navigate('/checkout');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select Collection Date and Time</h2>
      
      <div className="bg-white shadow-md rounded-lg mb-8">
        <div className="p-4 border-b text-gray-600">
          We are open every Thursday, Friday, Saturday and Sunday.
        </div>
        <TimeSelection onConfirm={handleTimeConfirm} />
      </div>

      <button
        onClick={() => navigate('/cart')}
        className="w-full bg-gray-200 text-gray-700 py-4 px-6 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Back to Cart
      </button>
    </div>
  );
};

export default TimeSelectionPage;