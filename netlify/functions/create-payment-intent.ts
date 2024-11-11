import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

if (!process.env.VITE_STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

interface PaymentIntentRequest {
  amount: number;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { amount } = JSON.parse(event.body || '{}') as PaymentIntentRequest;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creating payment intent' }),
    };
  }
};