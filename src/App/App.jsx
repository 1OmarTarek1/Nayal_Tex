import { useEffect, useState } from 'react'
import useInventoryStore from '../store/inventoryStore'
import ToTopReload from '../Hooks/ToTopReload'
import { AppRoutes, LoadingSec, MainNavbar, SidebarSec, ToTopBtn } from '../Layouts'
import './App.css'
import './index.css'


function App() {
  const [isLoadingSec, setIsLoadingSec] = useState(false);

  useEffect(() => {
    // Run automated cleanup for old transactions (Keep last 5 months)
    useInventoryStore.getState().cleanupOldTransactions();
  }, []);

  return (
    <>
      <MainNavbar />
      {/* <SidebarSec /> */}
      <div className="AllPages">
        <AppRoutes />
      </div>
      <ToTopBtn />
      <ToTopReload />
      <LoadingSec isLoadingSec={isLoadingSec} setIsLoadingSec={setIsLoadingSec} />
    </>
  )
}

export default App
