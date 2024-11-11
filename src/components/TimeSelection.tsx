import React from 'react';
import { format, addDays, setHours, setMinutes, isAfter, addMinutes } from 'date-fns';
import { useSettingsStore } from '../store/settingsStore';
import { TimeSlot } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TimeSelectionProps {
  onConfirm: (date: Date, time: string) => void;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({ onConfirm }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [bookedSlots, setBookedSlots] = React.useState<{ [key: string]: string[] }>({});
  const { settings } = useSettingsStore();

  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  // Fetch booked slots for a specific date
  const fetchBookedSlots = React.useCallback(async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const q = query(
      collection(db, 'timeSlots'),
      where('date', '==', dateStr)
    );

    try {
      const querySnapshot = await getDocs(q);
      const bookedTimes = querySnapshot.docs.map(doc => doc.data().time);
      setBookedSlots(prev => ({
        ...prev,
        [dateStr]: bookedTimes
      }));
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  }, []);

  // Fetch booked slots when date changes
  React.useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate, fetchBookedSlots]);

  const getTimeSlots = React.useCallback((date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const openingTime = setHours(setMinutes(date, 45), 10); // 10:45
    const closingTime = setHours(setMinutes(date, 30), 15); // 15:30
    let currentSlot = openingTime;

    // Add 15 minutes lead time to current time
    const minimumTime = addMinutes(new Date(), 15);
    const dateStr = format(date, 'yyyy-MM-dd');
    const bookedTimesForDate = bookedSlots[dateStr] || [];

    while (isAfter(closingTime, currentSlot)) {
      const slotTime = format(currentSlot, 'HH:mm');
      const slotDate = new Date(date);
      const [hours, minutes] = slotTime.split(':').map(Number);
      slotDate.setHours(hours, minutes, 0, 0);

      // Only add slot if it's in the future and not booked
      if (isAfter(slotDate, minimumTime)) {
        slots.push({
          time: slotTime,
          available: !bookedTimesForDate.includes(slotTime)
        });
      }

      currentSlot = addMinutes(currentSlot, 15);
    }

    return slots;
  }, [bookedSlots]);

  const isDateAvailable = React.useCallback((date: Date): boolean => {
    if (!settings) return false;

    // Check if date is blocked
    const dateStr = format(date, 'yyyy-MM-dd');
    if (settings.blockedDates.includes(dateStr)) return false;

    // Check if all slots for this date are in the past
    const slots = getTimeSlots(date);
    if (slots.length === 0) return false;

    return true;
  }, [settings, getTimeSlots]);

  const dates = React.useMemo(() => {
    const now = new Date();
    const availableDates = [];
    let currentDate = now;
    let daysChecked = 0;
    
    while (availableDates.length < 8 && daysChecked < 30) {
      const day = currentDate.getDay();
      // Check if it's Thursday (4) through Sunday (0)
      const isValidDay = day === 4 || day === 5 || day === 6 || day === 0;
      
      if (isValidDay && isDateAvailable(currentDate)) {
        availableDates.push({
          date: new Date(currentDate),
          isToday: format(currentDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
        });
      }
      
      currentDate = addDays(currentDate, 1);
      daysChecked++;
    }

    return availableDates;
  }, [isDateAvailable]);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      setIsConfirmed(true);
    }
  };

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedTime('');
    setIsConfirmed(false);
  };

  if (!settings) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Select Collection Date and Time</h2>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Date:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dates.map(({ date, isToday }) => (
            <button
              key={date.toISOString()}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(''); // Reset time when date changes
                setIsConfirmed(false);
              }}
              className={`p-3 rounded-lg border transition-colors ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <span>{format(date, 'EEE, MMM d')}</span>
                {isToday && (
                  <span className="text-xs mt-1 font-medium text-green-600">Today</span>
                )}
              </div>
            </button>
          ))}
        </div>
        {dates.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No available dates for collection. Please check back later.
          </p>
        )}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select Time:</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {getTimeSlots(selectedDate).map(({ time, available }) => (
              <button
                key={time}
                onClick={() => {
                  if (available) {
                    setSelectedTime(time);
                    setIsConfirmed(false);
                  }
                }}
                disabled={!available}
                className={`p-2 rounded-lg border ${
                  selectedTime === time
                    ? 'bg-blue-600 text-white'
                    : available
                    ? 'hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className={`flex-1 py-3 px-4 rounded-lg text-white transition-colors ${
            isConfirmed 
              ? 'bg-green-700 hover:bg-green-800' 
              : 'bg-green-600 hover:bg-green-700'
          } disabled:bg-gray-400`}
        >
          {isConfirmed ? 'Selection Confirmed ✓' : 'Confirm Selection'}
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Current Selection Display */}
      {(selectedDate || selectedTime) && (
        <div className={`${isConfirmed ? 'bg-green-50' : 'bg-gray-50'} p-4 rounded-lg transition-colors`}>
          <h3 className="text-lg font-semibold mb-2">Current Selection:</h3>
          <p className="text-gray-700">
            {selectedDate && selectedTime ? (
              `${format(selectedDate, 'EEEE, MMMM d, yyyy')} at ${selectedTime}`
            ) : (
              'Selection incomplete'
            )}
          </p>
        </div>
      )}
    </div>
  );
};