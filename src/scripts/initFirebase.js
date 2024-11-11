import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqm49bAzlJwx2SaTXJQZwrBMMM8BtP_1U",
  authDomain: "bolt-coffee-shop.firebaseapp.com",
  projectId: "bolt-coffee-shop",
  storageBucket: "bolt-coffee-shop.firebasestorage.app",
  messagingSenderId: "921119001263",
  appId: "1:921119001263:web:59aa28f9f2ce17ebb6225a"
};

// Sample products data
const sampleProducts = [
  {
    name: 'Espresso',
    description: 'Strong and pure coffee shot',
    price: 2.50,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500',
    options: { milks: true }
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 3.20,
    category: 'Coffees',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
    options: { milks: true }
  },
  {
    name: 'English Breakfast',
    description: 'Classic black tea blend',
    price: 2.80,
    category: 'Teas',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=500',
    options: { milks: true }
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
    options: { milks: true }
  }
];

async function initializeCollection(db, collectionName, initialData) {
  console.log(`Initializing ${collectionName} collection...`);
  const collectionRef = collection(db, collectionName);

  try {
    // Create collection with a dummy document if it doesn't exist
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      if (initialData) {
        // Add initial data if provided
        if (Array.isArray(initialData)) {
          await Promise.all(initialData.map(item => addDoc(collectionRef, item)));
        } else {
          await addDoc(collectionRef, initialData);
        }
      } else {
        // Add a dummy document to ensure collection creation
        await addDoc(collectionRef, {
          initialized: true,
          createdAt: new Date()
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

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Initialize all collections
    await Promise.all([
      initializeCollection(db, 'users'),
      initializeCollection(db, 'products', sampleProducts),
      initializeCollection(db, 'orders'),
      initializeCollection(db, 'timeSlots')
    ]);

    console.log('All collections initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();