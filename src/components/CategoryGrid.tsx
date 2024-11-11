import React from 'react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { useSettingsStore } from '../store/settingsStore';

interface CategoryGridProps {
  products: Product[];
  category: Category;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ products, category }) => {
  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  const filteredProducts = React.useMemo(() => {
    // Log for debugging
    console.log('All products:', products);
    console.log('Current category:', category);
    
    return products.filter((product) => {
      const normalizedProductCategory = product.category.toLowerCase().trim();
      const normalizedCategory = category.toLowerCase().trim();
      
      // Log for debugging
      console.log('Product category:', normalizedProductCategory);
      console.log('Comparing with:', normalizedCategory);
      
      return normalizedProductCategory === normalizedCategory;
    });
  }, [products, category]);

  console.log('Filtered products:', filteredProducts);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available in {category}.</p>
      </div>
    );
  }

  return (
    <div className="mt-[50px]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;