import React from 'react';
import { useProductStore } from '../store/productStore';
import { useSettingsStore } from '../store/settingsStore';
import { Category, Product } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const AdminSettings: React.FC = () => {
  const { settings, loading: settingsLoading, error: settingsError, updateMaxOrdersPerSlot, toggleBlockedDate } = useSettingsStore();
  const { products, loading: productsLoading, error: productsError, addProduct, deleteProduct } = useProductStore();
  
  const [newProduct, setNewProduct] = React.useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Coffees',
    image: '',
    availableOptions: []
  });
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [uploadingImage, setUploadingImage] = React.useState(false);

  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploadingImage(true);
      let imageUrl = newProduct.image;
      
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
      }

      await addProduct({
        ...newProduct,
        image: imageUrl
      });

      setNewProduct({
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
      setUploadingImage(false);
    }
  };

  const loading = settingsLoading || productsLoading;
  const error = settingsError || productsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

      {settings && (
        <>
          {/* Max Orders Per Slot */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Maximum Orders Per Time Slot</h3>
            <input
              type="number"
              min="1"
              value={settings.maxOrdersPerSlot}
              onChange={(e) => updateMaxOrdersPerSlot(parseInt(e.target.value))}
              className="w-24 p-2 border rounded"
            />
          </div>

          {/* Blocked Dates */}
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
                    toggleBlockedDate(selectedDate);
                    setSelectedDate('');
                  }
                }}
                disabled={!selectedDate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                Block/Unblock Date
              </button>
            </div>
            <div className="space-y-2">
              {settings.blockedDates.map((date) => (
                <div key={date} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <button
                    onClick={() => toggleBlockedDate(date)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Product Management</h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Product name"
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  placeholder="Price"
                  step="0.01"
                  className="p-2 border rounded"
                  required
                />
              </div>

              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                className="w-full p-2 border rounded"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as Category }))}
                  className="p-2 border rounded"
                  required
                >
                  <option value="Coffees">Coffees</option>
                  <option value="Teas">Teas</option>
                  <option value="Cakes">Cakes</option>
                  <option value="Hot Chocolate">Hot Chocolate</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Available Options:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {settings.productOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProduct.availableOptions?.includes(option.id)}
                        onChange={(e) => {
                          setNewProduct(prev => ({
                            ...prev,
                            availableOptions: e.target.checked
                              ? [...(prev.availableOptions || []), option.id]
                              : (prev.availableOptions || []).filter(id => id !== option.id)
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
                disabled={uploadingImage}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {uploadingImage ? 'Adding Product...' : 'Add Product'}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <span className="ml-4 text-gray-600">£{product.price.toFixed(2)}</span>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      {product.availableOptions && product.availableOptions.length > 0 && (
                        <p className="text-sm text-gray-500">
                          Options: {product.availableOptions.map(optId => 
                            settings.productOptions.find(opt => opt.id === optId)?.title
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};