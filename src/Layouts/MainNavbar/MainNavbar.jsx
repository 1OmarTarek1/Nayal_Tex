import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { IoHomeOutline, IoImagesOutline } from "react-icons/io5";
import { HamburgerBtn } from '../../Components';
import logo from "../../Assets/Images/Logo/logo2.png";
import { AiOutlineFileSearch, AiOutlineShop } from 'react-icons/ai';
import { GrDocumentPerformance } from 'react-icons/gr';
import './MainNavbar.css';

const MainNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);

  const controlNavbar = () => {
    if (window.scrollY - lastScrollY.current > 5) {
      // scroll down
      setShow(false);
    } else if (lastScrollY.current - window.scrollY > 5) {
      // scroll up
      setShow(true);
    }
    lastScrollY.current = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        !e.target.closest('.navMenu') &&
        !e.target.closest('.hamburger')
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <nav className={`navbar ${show ? 'navbarShow' : 'navbarHide'}`}>
      <div className="navContainer">
        <NavLink to="/" className="navLogo">
          <img src={logo} alt="Logo" className="logoImg" />
          <span className="nayalText">
            نيــــــــال تكــــس
            <br />
            <span className="nayalTextSubtitle">نُـسِـجَتْ بِـحُـبْ</span>
          </span>
        </NavLink>

        <ul className={`navMenu ${isOpen ? 'active' : ''}`}>
          <li className="navItem">
            <NavLink to="/" end className="navLink" onClick={() => setIsOpen(false)}>
              <span className="linkIcn"><IoHomeOutline /></span>
              الرئيسية
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/GalleryPage" className="navLink" onClick={() => setIsOpen(false)}>
              <span className="linkIcn"><IoImagesOutline /></span>
              <span>المعرض</span>
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/InventoryPage" className="navLink" onClick={() => setIsOpen(false)}>
              <span className="linkIcn"><AiOutlineShop size={21} /></span>
              <span>المخزون</span>
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/SalesPage" className="navLink" onClick={() => setIsOpen(false)}>
              <span className="linkIcn"><GrDocumentPerformance size={19} /></span>
              <span>المبيعات</span>
            </NavLink>
          </li>
          <li className="navItem">
            <NavLink to="/TransactionHistoryPage" className="navLink" onClick={() => setIsOpen(false)}>
              <span className="linkIcn"><AiOutlineFileSearch size={21} /></span>
              <span>السجل</span>
            </NavLink>
          </li>
        </ul>

        <div className="navActions">
          <HamburgerBtn
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className="hamburger"
          />
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
