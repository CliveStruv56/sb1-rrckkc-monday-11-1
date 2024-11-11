import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { Product, Settings } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const sampleProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Espresso',
    description: 'Strong and pure coffee shot',
    price: 2.50,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500',
    availableOptions: ['opt1', 'opt2'] // Example option IDs
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 3.20,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
    availableOptions: ['opt1', 'opt2'] // Example option IDs
  },
  {
    name: 'English Breakfast',
    description: 'Classic black tea blend',
    price: 2.80,
    category: 'Teas',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500',
    availableOptions: ['opt1', 'opt2'] // Example option IDs
  },
  {
    name: 'Carrot Cake',
    description: 'Moist cake with cream cheese frosting',
    price: 3.50,
    category: 'Cakes',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500'
  },
  {
    name: 'Classic Hot Chocolate',
    description: 'Rich and creamy hot chocolate',
    price: 3.00,
    category: 'Hot Chocolate',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500',
    availableOptions: ['opt1', 'opt2'] // Example option IDs
  }
];

async function initializeCollection(db: ReturnType<typeof getFirestore>, collectionName: string, initialData?: unknown) {
  console.log(`Initializing ${collectionName} collection...`);
  const collectionRef = collection(db, collectionName);

  try {
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      if (initialData) {
        if (Array.isArray(initialData)) {
          for (const item of initialData) {
            await addDoc(collectionRef, item);
          }
        } else {
          await setDoc(doc(db, collectionName, 'global'), initialData);
        }
      } else {
        await addDoc(collectionRef, {
          initialized: true,
          createdAt: new Date().toISOString()
        });
      }
      console.log(`${collectionName} collection initialized successfully!`);
    } else {
      console.log(`${collectionName} collection already exists.`);
    }
  } catch (error) {
    console.error(`Error initializing ${collectionName} collection:`, error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const defaultSettings: Settings = {
      maxOrdersPerSlot: 3,
      blockedDates: [],
      productOptions: [
        {
          id: 'opt1',
          title: 'Regular',
          price: 0
        },
        {
          id: 'opt2',
          title: 'Large',
          price: 0.50
        }
      ]
    };

    await Promise.all([
      initializeCollection(db, 'users'),
      initializeCollection(db, 'products', sampleProducts),
      initializeCollection(db, 'orders'),
      initializeCollection(db, 'timeSlots'),
      initializeCollection(db, 'settings', defaultSettings)
    ]);

    console.log('All collections initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

void initializeDatabase();