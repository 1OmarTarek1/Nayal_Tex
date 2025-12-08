import { useEffect } from 'react'
import useInventoryStore from '../store/inventoryStore'
import ToTopReload from '../Hooks/ToTopReload'
import { AppRoutes, MainNavbar, SidebarSec, ToTopBtn } from '../Layouts'
import './App.css'
import './index.css'


function App() {

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
    </>
  )
}

export default App
