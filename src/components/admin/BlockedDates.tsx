import React from 'react';

interface BlockedDatesProps {
  blockedDates: string[];
  onToggleDate: (date: string) => void;
}

export const BlockedDates: React.FC<BlockedDatesProps> = ({ blockedDates, onToggleDate }) => {
  const [selectedDate, setSelectedDate] = React.useState('');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Blocked Dates</h3>
      
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="p-2 border rounded"
        />
        <button
          onClick={() => {
            if (selectedDate) {
              onToggleDate(selectedDate);
              setSelectedDate('');
            }
          }}
          disabled={!selectedDate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Block/Unblock Date
        </button>
      </div>

      <div className="grid gap-2">
        {blockedDates.map((date) => (
          <div key={date} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <button
              onClick={() => onToggleDate(date)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};