import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';

// Sample products data
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Strong and pure coffee shot',
    price: 2.50,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500'
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 3.20,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500'
  },
  {
    id: '3',
    name: 'English Breakfast',
    description: 'Classic black tea blend',
    price: 2.80,
    category: 'Teas',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500'
  },
  {
    id: '4',
    name: 'Carrot Cake',
    description: 'Moist cake with cream cheese frosting',
    price: 3.50,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500'
  },
  {
    id: '5',
    name: 'Classic Hot Chocolate',
    description: 'Rich and creamy hot chocolate',
    price: 3.00,
    category: 'Hot Chocolate',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500'
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return products.length > 0 ? products : sampleProducts;
  } catch (error) {
    console.log('Error fetching products, using sample data:', error);
    return sampleProducts;
  }
};