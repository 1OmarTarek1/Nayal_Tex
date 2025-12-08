import './SectionHeader.css';

const SectionHeader = ({ title, scrollRef }) => {
    // Smooth scroll function
    const handleScroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const scrollAmount = 350;
        const targetScroll = direction === 'left'
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    };

    return (
        <div className="sectionHeader">

            {/* Right Button */}
            <button
                className="scrollBtn scrollBtn-right"
                onClick={() => handleScroll('right')}
                aria-label="تمرير لليمين"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
            {/* Title */}

            <div className="sectionTitle">{title}</div>

            {/* Left Button */}
            <button
                className="scrollBtn scrollBtn-left"
                onClick={() => handleScroll('left')}
                aria-label="تمرير لليسار"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
};

export default SectionHeader;
