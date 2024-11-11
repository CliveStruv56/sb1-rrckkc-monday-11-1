import React from 'react';
import { ProductOption } from '../../types';

interface ProductOptionsManagerProps {
  options: ProductOption[];
  onAdd: (option: Omit<ProductOption, 'id'>) => void;
  onUpdate: (option: ProductOption) => void;
  onDelete: (id: string) => void;
}

export const ProductOptionsManager: React.FC<ProductOptionsManagerProps> = ({
  options,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [newOption, setNewOption] = React.useState({ 
    title: '', 
    price: 0,
    isDefault: false 
  });

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOption.title.trim()) {
      onAdd(newOption);
      setNewOption({ title: '', price: 0, isDefault: false });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Product Options</h3>

      <form onSubmit={handleAddOption} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newOption.title}
            onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
            placeholder="Option title (e.g., 'Regular', 'Large')"
            className="flex-1 p-2 border rounded"
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-gray-500">£</span>
            <input
              type="number"
              value={newOption.price}
              onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) || 0 })}
              placeholder="Additional price"
              step="0.10"
              min="0"
              className="w-24 p-2 border rounded"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={newOption.isDefault}
              onChange={(e) => setNewOption({ ...newOption, isDefault: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">
              Default Option
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Option
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {options.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No product options added yet.</p>
        ) : (
          options.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={option.title}
                  onChange={(e) => onUpdate({ ...option, title: e.target.value })}
                  className="p-2 border rounded"
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">£</span>
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => onUpdate({ ...option, price: parseFloat(e.target.value) || 0 })}
                    step="0.10"
                    min="0"
                    className="w-24 p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={option.isDefault || false}
                    onChange={(e) => onUpdate({ ...option, isDefault: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Default Option</span>
                </div>
              </div>
              <button
                onClick={() => onDelete(option.id)}
                className="text-red-600 hover:text-red-800 px-4 py-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};