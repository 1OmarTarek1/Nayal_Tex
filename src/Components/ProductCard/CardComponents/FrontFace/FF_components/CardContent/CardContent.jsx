import { useEffect, useState } from 'react'
import useInventoryStore from '../../../../../../store/inventoryStore'
import './CardContent.css'



const CardContent = ({ allData, selectedVariantIndex = 0 }) => {
    const [localData, setLocalData] = useState(null)
    
    // Subscribe to store changes
    const variant = useInventoryStore(state => {
        const type = state.curtainTypes.find(t => t.id === allData?.typeId)
        if (!type) return null
        const shape = type.shapes.find(s => s.id === allData?.id)
        if (!shape) return null
        return shape.variants?.[selectedVariantIndex]
    })

    useEffect(() => {
        if (variant) {
            setLocalData(variant)
        }
    }, [variant, selectedVariantIndex])

    const inStock = localData?.inStock ?? 0
    const sold = localData?.sold ?? 0
    const total = inStock + sold

    return (
        <ul className='cardContent'>
            <li className="contentItem">
                <span className="contentText DT-text">المخزون</span>
                <span className="contentValue DT-text">{inStock}</span>
            </li>
            <li className="contentItem">
                <span className="contentText DT-text">المباع</span>
                <span className="contentValue DT-text">{sold}</span>
            </li>
            <li className="contentItem">
                <span className="contentText DT-text">الاجمالي</span>
                <span className="contentValue DT-text">{total}</span>
            </li>
        </ul>
    )
}

export default CardContent