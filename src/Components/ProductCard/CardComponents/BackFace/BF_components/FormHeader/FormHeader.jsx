import './FormHeader.css'
import useInventoryStore from '../../../../../../store/inventoryStore'

const FormHeader = ({ activeAction, allData, selectedVariantIndex = 0 }) => {
    // Use the passed-in allData directly to get the correct variant
    // allData already has the shape info, so just index into its variants
    const variant = allData?.variants?.[selectedVariantIndex]

    // Still fetch the curtain type from store for the type name
    const curtainType = useInventoryStore(state => 
        state.curtainTypes.find(t => t.id === allData?.typeId)
    )

    return (
        <header className="formHeader">
            <div className="formTitle">
                {activeAction === 'add' ? 'إدخال منتج' : 'إخراج منتج'}
            </div>
            <ul className="productData">
                <li className="dataItem">
                    <div className="dataTitle">النوع</div>
                    <div className="dataValue">{curtainType?.name || 'N/A'}</div>
                </li>
                <li className="dataItem">
                    <div className="dataTitle">الشكل</div>
                    <div className="dataValue">{allData?.name || 'N/A'}</div>
                </li>
                <li className="dataItem">
                    <div className="dataTitle">اللون</div>
                    <div className="dataValue">{variant?.name || 'N/A'}</div>
                </li>
                <li className="dataItem">
                    <div className="dataTitle">المخزون</div>
                    <div className="dataValue">{variant?.inStock || 0}</div>
                </li>
            </ul>
        </header>
    )
}

export default FormHeader