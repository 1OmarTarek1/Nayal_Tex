import './InventoryActions.css'


const InventoryActions = ({ handleAction }) => {
    return (
        <div className="InventoryActionsBtns">
            <button className="add" onClick={() => handleAction('add')}>+</button>
            <button className="Remove" onClick={() => handleAction('remove')}>-</button>
        </div>
    )
}

export default InventoryActions