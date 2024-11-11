import React from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred');
        return;
      }

      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold
                 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

interface MainPaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export const PaymentForm: React.FC<MainPaymentFormProps> = ({ 
  amount,
  onSuccess 
}) => {
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  React.useEffect(() => {
    const initializePayment = async () => {
      try {
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error initializing payment:', error);
      }
    };

    initializePayment();
  }, [amount]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent clientSecret={clientSecret} onSuccess={onSuccess} />
    </Elements>
  );
};