import './ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
            data-text={"نُـسِـجَتْ بِـحُـبْ"}
            style={{ animationDuration }}
        >
            {text}
        </div>
    );
};

export default ShinyText;
