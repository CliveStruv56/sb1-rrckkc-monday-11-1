import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderDetails } from '../types';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails as OrderDetails | undefined;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/menu', { replace: true });
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-8">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Order Confirmed!</h2>
        <p className="text-center">Your order has been successfully placed.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        {/* Collection Time */}
        <div className="mb-6 pb-6 border-b">
          <h4 className="font-medium mb-2">Collection Time:</h4>
          <p className="text-lg">
            {new Date(orderDetails.pickupDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} at {orderDetails.pickupTime}
          </p>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Items:</h4>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex justify-between mb-3">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">£{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>£{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/menu', { replace: true })}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Return to Menu
      </button>
    </div>
  );
};

export default OrderConfirmation;