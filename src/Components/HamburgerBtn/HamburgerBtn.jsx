import './HamburgerBtn.css'

const HamburgerBtn = ({ isOpen, setIsOpen }) => {
    return (
        <div className="hamburger">
            <button
                className={`hamburgerBtn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <span className="line line1"></span>
                <span className="line line2"></span>
                <span className="line line3"></span>
            </button>
        </div>
    )
}

export default HamburgerBtn;