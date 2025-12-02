import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaFileContract, FaHouse, FaImages, FaShop, FaClipboardList } from 'react-icons/fa6'
import logoImg from '../../assets/Images/Logo/Logo2.png'
import './SidebarSec.css'
import { MdOutlinePushPin, MdPushPin } from 'react-icons/md'
import { PiPushPin, PiPushPinSlashFill } from 'react-icons/pi'




const SidebarSec = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  return (
    <aside className={isSidebarOpen ? "sidebarSec closed" : "sidebarSec "}>
      <header className='sideHeader'>
        <NavLink to="/" className="navLogo">
          <img src={logoImg} alt="Logo" className="logoImg" />
          <span className="nayalText">
            نيــــال تكــــــس
            <br />
            <span className="nayalTextSubtitle">نُـسِـجَتْ بِـحُـبْ</span>
          </span>
        </NavLink>
      </header>
      <ul className={"sideList"} >
        <li className='sideItem'>
          <NavLink to='/' className={"ItemLink"}>
            <span><FaHouse /></span>
            <span className='itemTxt'>الصفحة الرئيسية</span>
          </NavLink>
        </li>
        <li className='sideItem'>
          <NavLink to='/GalleryPage' className={"ItemLink"}>
            <span><FaImages /></span>
            <span className='itemTxt'>معرض الاعمال</span>
          </NavLink>
        </li>
        <li className='sideItem'>
          <NavLink to='/InventoryPage' className={"ItemLink"}>
            <span><FaShop /></span>
            <span className='itemTxt'>مخزون المتجر</span>
          </NavLink>
        </li>
        <li className='sideItem'>
          <NavLink to='/SalesPage' className={"ItemLink"}>
            <span><FaFileContract /></span>
            <span className='itemTxt'>مبيعات المتجر</span>
          </NavLink>
        </li>
        <li className='sideItem'>
          <NavLink to='/TransactionHistoryPage' className={"ItemLink"}>
            <span><FaClipboardList /></span>
            <span className='itemTxt'>سجل العمليات</span>
          </NavLink>
        </li>
      </ul>
      <footer className='sideFooter'>
        <button className="clsSideBtn" onClick={handleToggleSidebar}>
          <span>{isSidebarOpen ? <PiPushPin /> : <PiPushPinSlashFill />}</span>
          <span className='itemTxt'>{isSidebarOpen ? "تثبيت" : "إلغاء التثبيت"}</span>
        </button>
      </footer>
    </aside>
  )
}

export default SidebarSec