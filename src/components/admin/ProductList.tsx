import React from 'react';
import { Product, ProductOption } from '../../types';

interface ProductListProps {
  products: Product[];
  options: ProductOption[];
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, options, onDelete }) => {
  return (
    <div className="mt-8 space-y-4">
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No products available.</p>
      ) : (
        products.map((product) => (
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
                      options?.find(opt => opt.id === optId)?.title
                    ).filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onDelete(product.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};