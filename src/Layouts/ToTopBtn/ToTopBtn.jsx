import { useState, useEffect, useRef } from 'react';
import { IoArrowUp } from "react-icons/io5";
import './ToTopBtn.css';

const ToTopBtn = () => {
    // State to control visibility and bottom position
    const [visible, setVisible] = useState(false);
    const [atBottom, setAtBottom] = useState(false); // New state to check if at bottom
    const rafRef = useRef(null); // Reference for requestAnimationFrame

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        const shouldBeVisible = scrolled > 700;
        const shouldBeAtBottom = scrollHeight - scrolled <= clientHeight + 10;

        // Only update state if values actually changed
        setVisible(prev => shouldBeVisible !== prev ? shouldBeVisible : prev);
        setAtBottom(prev => shouldBeAtBottom !== prev ? shouldBeAtBottom : prev);
    };

    const handleScroll = () => {
        // Cancel any pending animation frame
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        // Throttle with requestAnimationFrame for smooth 60fps updates
        rafRef.current = requestAnimationFrame(toggleVisible);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []); // Empty dependency array to run effect once

    return (
        <>
            <button
                className={`arrow-btn ${visible ? 'visible' : ''} ${atBottom ? 'at-bottom' : ''}`}
                onClick={scrollToTop}>
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
