import React from 'react';
import { useProductStore } from '../../store/productStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useDemoModeStore } from '../../store/demoModeStore';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

export const AdminSettings: React.FC = () => {
  const { 
    settings, 
    loading: settingsLoading, 
    error: settingsError, 
    updateMaxOrdersPerSlot, 
    toggleBlockedDate,
    addProductOption,
    updateProductOption,
    deleteProductOption
  } = useSettingsStore();

  const { 
    products, 
    loading: productsLoading, 
    error: productsError, 
    addProduct, 
    deleteProduct,
    fetchProducts
  } = useProductStore();

  const { isDemoMode, toggleDemoMode } = useDemoModeStore();

  // State for product options
  const [newOptionTitle, setNewOptionTitle] = React.useState('');
  const [newOptionPrice, setNewOptionPrice] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState('');

  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
    fetchProducts();
  }, [fetchProducts]);

  const handleAddOption = () => {
    if (newOptionTitle.trim()) {
      addProductOption({
        title: newOptionTitle,
        price: newOptionPrice
      });
      setNewOptionTitle('');
      setNewOptionPrice(0);
    }
  };

  if (settingsLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (settingsError || productsError) {
    return (
      <div className="text-red-600 p-4">
        Error: {settingsError || productsError}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No settings available. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

      {/* Demo Mode Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Demo Mode</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Demo Mode is {isDemoMode ? 'Active' : 'Inactive'}</p>
            <p className="text-sm text-gray-600">
              {isDemoMode 
                ? 'Orders will be processed without real payments' 
                : 'Orders will require real payments'}
            </p>
          </div>
          <button
            onClick={toggleDemoMode}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDemoMode 
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isDemoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          </button>
        </div>
      </div>

      {/* Rest of the settings remain the same */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Product Options</h3>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Option name (e.g., 'Regular', 'Large')"
              className="flex-1 p-2 border rounded"
              value={newOptionTitle}
              onChange={(e) => setNewOptionTitle(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-gray-500">£</span>
              <input
                type="number"
                value={newOptionPrice}
                onChange={(e) => setNewOptionPrice(parseFloat(e.target.value) || 0)}
                step="0.10"
                min="0"
                className="w-24 p-2 border rounded"
              />
            </div>
            <button
              onClick={handleAddOption}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Option
            </button>
          </div>
          {settings.productOptions?.map((option) => (
            <div key={option.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={option.title}
                  onChange={(e) => updateProductOption({ ...option, title: e.target.value })}
                  className="p-2 border rounded"
                />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">£</span>
                  <input
                    type="number"
                    value={option.price}
                    onChange={(e) => updateProductOption({ ...option, price: parseFloat(e.target.value) || 0 })}
                    step="0.10"
                    min="0"
                    className="w-24 p-2 border rounded"
                  />
                </div>
              </div>
              <button
                onClick={() => deleteProductOption(option.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

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
        <div className="grid gap-2">
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Product Management</h3>
        <ProductForm 
          options={settings.productOptions || []} 
          onSubmit={addProduct} 
        />
        <ProductList 
          products={products} 
          options={settings.productOptions || []} 
          onDelete={deleteProduct} 
        />
      </div>
    </div>
  );
};

export default AdminSettings;