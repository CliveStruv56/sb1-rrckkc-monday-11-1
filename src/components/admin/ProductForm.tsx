import React from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Category, ProductOption } from '../../types';

interface ProductFormProps {
  options: ProductOption[];
  onSubmit: (product: any) => Promise<void>;
}

export const ProductForm: React.FC<ProductFormProps> = ({ options, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: 0,
    category: 'Coffees' as Category,
    image: '',
    availableOptions: [] as string[]
  });
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !selectedImage) return;

    try {
      setIsSubmitting(true);
      const imageRef = ref(storage, `products/${Date.now()}_${selectedImage.name}`);
      const uploadResult = await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      
      await onSubmit({
        ...formData,
        image: imageUrl
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Coffees',
        image: '',
        availableOptions: []
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (£)
          </label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            step="0.01"
            min="0"
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Coffees">Coffees</option>
            <option value="Teas">Teas</option>
            <option value="Cakes">Cakes</option>
            <option value="Hot Chocolate">Hot Chocolate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Options
        </label>
        <div className="grid grid-cols-3 gap-2">
          {options?.map((option) => (
            <label key={option.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.availableOptions.includes(option.id)}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    availableOptions: e.target.checked
                      ? [...prev.availableOptions, option.id]
                      : prev.availableOptions.filter(id => id !== option.id)
                  }));
                }}
                className="rounded border-gray-300"
              />
              <span>{option.title} (+£{option.price.toFixed(2)})</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !selectedImage}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
};