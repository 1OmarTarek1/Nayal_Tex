import { ToTopBtn } from '../Components'
import { AppRoutes, MainNavbar, SidebarSec } from '../Layouts'
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
    </>
  )
}

export default App
