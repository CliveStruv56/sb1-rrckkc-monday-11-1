import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCqm49bAzlJwx2SaTXJQZwrBMMM8BtP_1U",
  authDomain: "bolt-coffee-shop.firebaseapp.com",
  projectId: "bolt-coffee-shop",
  storageBucket: "bolt-coffee-shop.firebasestorage.app",
  messagingSenderId: "921119001263",
  appId: "1:921119001263:web:59aa28f9f2ce17ebb6225a"
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForConnection(db) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      // Try to perform a simple operation
      const testDoc = doc(db, '_test_connection', 'test');
      await getDoc(testDoc);
      console.log('Connection established successfully');
      return true;
    } catch (error) {
      attempts++;
      console.log(`Connection attempt ${attempts}/${maxAttempts} failed, retrying...`);
      await delay(2000); // Wait 2 seconds before retrying
    }
  }
  return false;
}

async function setAdminRole(email, password) {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('Initializing Firebase and checking connection...');
    
    // Wait for connection
    const isConnected = await waitForConnection(db);
    if (!isConnected) {
      throw new Error('Could not establish connection to Firebase after multiple attempts');
    }

    // Sign in the user
    console.log('Signing in user...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Get existing user data with retry logic
    let userData = {};
    let retries = 3;
    while (retries > 0) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          userData = userDoc.data();
        }
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await delay(1000);
      }
    }

    // Update user document with admin role
    console.log('Setting admin role...');
    await setDoc(doc(db, 'users', uid), {
      ...userData,
      email,
      isAdmin: true,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    console.log('Admin role set successfully!');
    
    // Wait a moment to ensure data is synchronized
    await delay(2000);
    process.exit(0);
  } catch (error) {
    console.error('Error setting admin role:', error);
    process.exit(1);
  }
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node setAdmin.js <email> <password>');
  process.exit(1);
}

setAdminRole(email, password);