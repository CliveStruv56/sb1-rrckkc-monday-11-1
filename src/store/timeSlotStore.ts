import create from 'zustand';
import { addMinutes, setHours, setMinutes, format, isAfter } from 'date-fns';

interface TimeSlot {
  date: string;
  time: string;
  orderId: string;
}

interface TimeSlotStore {
  bookedSlots: TimeSlot[];
  bookTimeSlot: (date: Date, time: string, orderId: string) => void;
  isSlotAvailable: (date: Date, time: string) => boolean;
  getTimeSlots: (date: Date) => { time: string; available: boolean }[];
}

export const useTimeSlotStore = create<TimeSlotStore>((set, get) => ({
  bookedSlots: [],
  
  bookTimeSlot: (date: Date, time: string, orderId: string) => {
    set((state) => ({
      bookedSlots: [
        ...state.bookedSlots,
        { date: format(date, 'yyyy-MM-dd'), time, orderId }
      ]
    }));
  },

  isSlotAvailable: (date: Date, time: string) => {
    const { bookedSlots } = get();
    const dateStr = format(date, 'yyyy-MM-dd');
    return !bookedSlots.some(slot => 
      slot.date === dateStr && slot.time === time
    );
  },

  getTimeSlots: (date: Date) => {
    const slots = [];
    const openingTime = setHours(setMinutes(date, 45), 10); // 10:45
    const closingTime = setHours(setMinutes(date, 30), 15); // 15:30
    let currentSlot = openingTime;

    // Add 15 minutes lead time to current time
    const minimumTime = addMinutes(new Date(), 15);

    while (isAfter(closingTime, currentSlot)) {
      const slotTime = format(currentSlot, 'HH:mm');
      const slotDate = new Date(date);
      const [hours, minutes] = slotTime.split(':').map(Number);
      slotDate.setHours(hours, minutes, 0, 0);

      // Only add slot if it's in the future (considering lead time)
      if (isAfter(slotDate, minimumTime)) {
        slots.push({
          time: slotTime,
          available: get().isSlotAvailable(date, slotTime)
        });
      }

      currentSlot = addMinutes(currentSlot, 15);
    }

    return slots;
  },
}));