import { useRef } from 'react'
import FormHeader from './BF_components/FormHeader/FormHeader'
import AddProduct from './BF_components/AddProduct/AddProduct'
import RemoveProduct from './BF_components/RemoveProduct/RemoveProduct'
import FormFooter from './BF_components/FormFooter/FormFooter'
import './BackFace.css'

const BackFace = ({ activeAction, handleCancel, allData, onSubmit, selectedVariantIndex = 0 }) => {
    const addProductRef = useRef()
    const removeProductRef = useRef()

    const handleSave = () => {
        if (activeAction === 'add' && addProductRef.current) {
            addProductRef.current.handleSubmit?.()
        } else if (activeAction === 'remove' && removeProductRef.current) {
            removeProductRef.current.handleSubmit?.()
        }
    }

    return (
        <>
            <FormHeader activeAction={activeAction} allData={allData} selectedVariantIndex={selectedVariantIndex} />
            {activeAction === 'add' && <AddProduct ref={addProductRef} allData={allData} onSubmit={onSubmit} selectedVariantIndex={selectedVariantIndex} />}
            {activeAction === 'remove' && <RemoveProduct ref={removeProductRef} allData={allData} onSubmit={onSubmit} selectedVariantIndex={selectedVariantIndex} />}
            <FormFooter handleCancel={handleCancel} onSave={handleSave} />
        </>
    )
}

export default BackFace