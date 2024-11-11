import { useEffect } from 'react';
import { useProductStore } from '../store/productStore';

export const useProducts = () => {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error };
};