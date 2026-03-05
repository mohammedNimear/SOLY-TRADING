
// components/sales/ProductSearch.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import apiClient from '../../services/api';

const ProductSearch = ({ onAddProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        searchProducts(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchProducts = async (searchTerm) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/products/search', { params: { q: searchTerm } });
      setResults(data);
    } catch (error) {
      console.error('خطأ في البحث عن المنتجات:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <Search className="w-5 h-5 text-gray-400 mx-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن منتج بالاسم أو الباركود..."
          className="w-full py-2 px-3 outline-none dark:bg-gray-800 dark:text-white"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                onAddProduct(product);
                setQuery('');
                setResults([]);
              }}
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.barcode}</p>
              </div>
              <div className="flex items-center">
                <span className="ml-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  {product.sellingPrice} د.ل
                </span>
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
