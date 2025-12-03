import ToTopReload from '../Hooks/ToTopReload'
import { AppRoutes, MainNavbar, SidebarSec, ToTopBtn } from '../Layouts'
import './App.css'
import './index.css'


function App() {

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
