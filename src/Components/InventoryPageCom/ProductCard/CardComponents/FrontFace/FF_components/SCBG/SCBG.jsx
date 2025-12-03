import './SCBG.css'


//Switch Colors Buttons Group Component
const SCBG = ({ variants = [], selectedIndex = 0, onSelect = () => {}, activeFilterColor = 'all', isManuallySelected = false }) => {
    return (
        <ul className='SCBG-container'>
            {variants.map((v, i) => (
                <li
                    key={v.id || i}
                    className={`coloritem ${selectedIndex === i ? 'active' : ''} ${!isManuallySelected && activeFilterColor !== 'all' && v.id === activeFilterColor ? 'match' : ''}`}
                    style={{ backgroundColor: v.code || 'transparent' }}
                    onClick={() => onSelect(i)}
                    title={v.name}
                ></li>
            ))}
        </ul>
    )
}

export default SCBG