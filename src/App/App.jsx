import { useEffect, useState } from 'react'
import { useInventoryStore, ToTopReload } from '../Hooks'
import { AppRoutes, LoadingSec, MainNavbar, SidebarSec, ToTopBtn, SplashScreen } from '../Layouts'
import './App.css'
import './index.css'


function App() {
  const [isLoadingSec, setIsLoadingSec] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
    // Mark as seen immediately so it doesn't show on reload in same tab if desired
    // Or keep it false until animation completes
    }

    // Run automated cleanup for old transactions (Keep last 5 months)
    useInventoryStore.getState().cleanupOldTransactions();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <LoadingSec isLoadingSec={isLoadingSec} setIsLoadingSec={setIsLoadingSec} />
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
