import './DynamicNav.css'


const DynamicNav = ({ className, title, children }) => {
    return (
        <nav className={`dynamicNav ${className || ""}`}>
            <div className="navContetn">
                {title && <h1 className='navTitle'>{title || ""}</h1>}
                {children || ""}
            </div>
        </nav>
    )
}

export default DynamicNav