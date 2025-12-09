import { useEffect, useState, useRef } from 'react';
import logoImg from '../../assets/Images/Logo/logoW.png';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
    const [stage, setStage] = useState(1);
    const [hide, setHide] = useState(false);
    const splashContentRef = useRef(null);
    const animationTimers = useRef([]);

    // Clear timers on unmount
    useEffect(() => {
        return () => {
            animationTimers.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const handleHideSplash = () => {
        setHide(true);
        setTimeout(() => onComplete(), 500);
    };

    useEffect(() => {
        // Stage 1: Logo spin
        const stage1Timer = setTimeout(() => {
            setStage(2);
            splashContentRef.current?.classList.add('stage-intermediate');
        }, 1200);

        // Stage 2a: Move logo left
        const stage2aTimer = setTimeout(() => {
            setStage(3);
            splashContentRef.current?.classList.add('stage-two-a');
        }, 300); // Delay a bit after rotate fixed

        // Stage 2b: Show border & texts
        const stage2bTimer = setTimeout(() => {
            setStage(4);
            splashContentRef.current?.classList.add('stage-two-b');
        }, 1800);

        animationTimers.current.push(stage1Timer, stage2aTimer, stage2bTimer);
    }, [onComplete]);

    // Hide on click
    useEffect(() => {
        const handleClick = () => handleHideSplash();
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className={`splash-screen ${hide ? 'fade-out' : ''}`} style={{ cursor: 'pointer' }}>
            <div ref={splashContentRef} className="splash-content">
                <div className="splash-logo-wrapper">
                    <img src={logoImg} alt="Nayal Tex Logo" className="splash-logo" />
                </div>

                <div className="titleWrapper">
                    <div className="brand-name">Nayal<span>Tex</span></div>
                    <div className="brand-slogan">Woven With Love</div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
