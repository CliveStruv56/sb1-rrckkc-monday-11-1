import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';

interface BookedSlot {
  date: string; // ISO string
  time: string;
  orderId: string;
}

export const checkSlotAvailability = async (date: Date, time: string): Promise<boolean> => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const q = query(
    collection(db, 'timeSlots'),
    where('date', '==', dateStr),
    where('time', '==', time)
  );

  const querySnapshot = await getDocs(q);
  const bookedCount = querySnapshot.size;
  
  // Currently limiting to 1 booking per slot
  return bookedCount < 1;
};

export const bookTimeSlot = async (date: Date, time: string, orderId: string): Promise<void> => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  await addDoc(collection(db, 'timeSlots'), {
    date: dateStr,
    time,
    orderId,
    createdAt: Timestamp.now()
  });
};

export const getAvailableSlots = async (date: Date): Promise<string[]> => {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const q = query(
    collection(db, 'timeSlots'),
    where('date', '==', dateStr)
  );

  const querySnapshot = await getDocs(q);
  const bookedSlots = querySnapshot.docs.map(doc => doc.data().time);
  
  return bookedSlots;
};