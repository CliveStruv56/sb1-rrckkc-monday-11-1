import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import { useProducts } from './hooks/useProducts';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useSettingsStore } from './store/settingsStore';
import { NetworkStatus } from './components/NetworkStatus';
import { Cart } from './components/Cart';
import { UserMenu } from './components/UserMenu';
import { Logo } from './components/Logo';
import { Navigation } from './components/Navigation';
import { Category } from './types';

const LandingPage = React.lazy(() => import('./components/LandingPage'));
const InfoPage = React.lazy(() => import('./components/InfoPage'));
const CategoryGrid = React.lazy(() => import('./components/CategoryGrid'));
const CartSummary = React.lazy(() => import('./components/CartSummary'));
const TimeSelectionPage = React.lazy(() => import('./components/TimeSelectionPage'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const OrderConfirmation = React.lazy(() => import('./components/OrderConfirmation'));
const AdminSettings = React.lazy(() => import('./components/admin/AdminSettings'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.email === 'admin@example.com';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function CategoryPage() {
  const { category = 'Coffees' } = useParams<{ category?: string }>();
  const { products, loading, error } = useProducts();

  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading products. Please try again later.</div>
      </div>
    );
  }

  // Handle category formatting
  let displayCategory: Category;
  const lowercaseCategory = category.toLowerCase();
  
  if (lowercaseCategory === 'hotchocolate') {
    displayCategory = 'Hot Chocolate';
  } else {
    displayCategory = (category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()) as Category;
  }

  return <CategoryGrid products={products} category={displayCategory} />;
}

function AppContent() {
  const categories: Category[] = ['Coffees', 'Teas', 'Cakes', 'Hot Chocolate'];
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { items } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  React.useEffect(() => {
    useSettingsStore.getState().fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <LandingPage />
          </Suspense>
        } />
        
        <Route
          path="*"
          element={
            <>
              <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                  <div className="flex justify-between items-center mb-2">
                    <Link to="/menu" className="flex items-center gap-4">
                      <Logo className="w-16 h-16" />
                      <span className="text-3xl font-bold text-gray-900">
                        Some Good Cuppa
                      </span>
                    </Link>
                    <div className="flex items-center space-x-6">
                      {totalItems > 0 && (
                        <Link
                          to="/cart"
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>View Cart ({totalItems})</span>
                        </Link>
                      )}
                      <UserMenu />
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2"
                      >
                        <span className="sr-only">Open menu</span>
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <Navigation 
                    categories={categories}
                    isMenuOpen={isMenuOpen}
                    onMenuItemClick={() => setIsMenuOpen(false)}
                  />
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-6 py-6 mt-48">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                }>
                  <Routes>
                    <Route path="/menu" element={<InfoPage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/cart" element={<CartSummary />} />
                    <Route path="/collection-time" element={<TimeSelectionPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmation" element={<OrderConfirmation />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminSettings />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Suspense>
              </main>

              <Cart />
              <NetworkStatus />
            </>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;