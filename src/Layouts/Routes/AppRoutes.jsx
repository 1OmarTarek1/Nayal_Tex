import { Routes, Route } from 'react-router-dom';
import { GalleryPage, HomePage, InventoryPage, SalesPage, TransactionHistoryPage } from '../../Pages';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/GalleryPage" element={<GalleryPage />} />
        <Route path="/InventoryPage" element={<InventoryPage />} />
        <Route path="/SalesPage" element={<SalesPage />} />
        <Route path="/TransactionHistoryPage" element={<TransactionHistoryPage />} />
      </Routes>
    </>
  )
}

export default AppRoutes