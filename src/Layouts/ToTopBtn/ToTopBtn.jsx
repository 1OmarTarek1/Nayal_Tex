import { useState, useEffect } from 'react';
import { IoArrowUp } from "react-icons/io5";
import './ToTopBtn.css';

const ToTopBtn = () => {
    // State to control visibility and bottom position
    const [visible, setVisible] = useState(false);
    const [atBottom, setAtBottom] = useState(false); // New state to check if at bottom

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrolled > 700) {
            setVisible(true);
        } else if (scrolled <= 700) {
            setVisible(false);
        }

        // Check if at the bottom of the page
        if (scrollHeight - scrolled <= clientHeight + 10) {
            setAtBottom(true);
        } else {
            setAtBottom(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => {
            window.removeEventListener('scroll', toggleVisible);
        };
    }, []); // Empty dependency array to run effect once

    return (
        <>
            <button 
                className='arrow-btn' 
                onClick={scrollToTop} 
                style={{
                    bottom: visible ? (atBottom ? '15px' : '25px') : '-50px',
                    left: atBottom ? '10px' : '50%', // Position left when at bottom
                    transform: atBottom ? 'translateX(0%)' : 'translateX(-50%)', // Change transform based on position
                }}>
                <div className="lines-wrapper">
                    <span className="lineBtn line-1">
                        <IoArrowUp />
                    </span>
                    <span className="lineBtn line-2">
                        <IoArrowUp />
                    </span>
                </div>
            </button>
        </>
    );
};

export default ToTopBtn;
