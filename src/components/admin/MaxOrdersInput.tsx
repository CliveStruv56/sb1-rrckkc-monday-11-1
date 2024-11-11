import React from 'react';

interface MaxOrdersInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const MaxOrdersInput: React.FC<MaxOrdersInputProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Maximum Orders Per Time Slot</h3>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-24 p-2 border rounded"
      />
    </div>
  );
};