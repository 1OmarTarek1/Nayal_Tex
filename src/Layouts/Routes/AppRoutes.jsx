import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Eager load Home page
import { HomePage } from '../../Pages';

// Lazy load other pages
const GalleryPage = lazy(() => import('../../Pages/GalleryPage/GalleryPage'));
const InventoryPage = lazy(() => import('../../Pages/InventoryPage/InventoryPage'));
const SalesPage = lazy(() => import('../../Pages/SalesPage/SalesPage'));
const TransactionHistoryPage = lazy(() => import('../../Pages/TransactionHistoryPage/TransactionHistoryPage'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5rem',
    color: '#666'
  }}>
    جاري التحميل...
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/GalleryPage" element={<GalleryPage />} />
        <Route path="/InventoryPage" element={<InventoryPage />} />
        <Route path="/SalesPage" element={<SalesPage />} />
        <Route path="/TransactionHistoryPage" element={<TransactionHistoryPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes