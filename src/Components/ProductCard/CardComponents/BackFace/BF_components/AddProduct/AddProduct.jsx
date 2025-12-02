import { useState, forwardRef, useImperativeHandle } from 'react'
import { useAddProduct } from '../../../../../../hooks/useInventory'
import useInventoryStore from '../../../../../../store/inventoryStore'
import Toast from '../../../../../Toast/Toast'
import './AddProduct.css'

const AddProduct = forwardRef(({ allData, onSubmit, selectedVariantIndex = 0 }, ref) => {
    const [amount, setAmount] = useState('')
    const [toast, setToast] = useState(null)
    const addProduct = useAddProduct()
    const variant = allData?.variants?.[selectedVariantIndex]

    const showToast = (message, type = 'error') => {
        setToast({ message, type })
    }

    const validateAndSubmit = () => {
        const qty = parseInt(amount, 10)
        
        if (!amount || amount.trim() === '') {
            showToast('الرجاء إدخال كمية', 'warning')
            return
        }
        
        if (isNaN(qty) || qty <= 0) {
            showToast('الكمية يجب أن تكون رقم موجب', 'error')
            return
        }
        
        if (qty > 1000) {
            showToast('الكمية لا يمكن أن تتجاوز 1000', 'error')
            return
        }

        if (!variant) {
            showToast('لم يتم العثور على اللون', 'error')
            return
        }

        // Pass metadata with the transaction
        addProduct(allData.typeId, allData.id, variant.id, qty, {
            note: `Added ${qty} units manually`
        })
        showToast(`تم إضافة ${qty} وحدة بنجاح`, 'success')
        setAmount('')
        setTimeout(() => {
            onSubmit?.()
        }, 1500)
    }

    const handleSubmit = () => {
        validateAndSubmit()
    }

    useImperativeHandle(ref, () => ({
        handleSubmit
    }))

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <input
                id='addInput'
                className='formInput'
                type="number"
                placeholder="الكمية"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                min="1"
                max="1000"
            />
            {/* {variant && <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>المخزون الحالي: {variant.inStock}</p>} */}
        </div>
    )
})

AddProduct.displayName = 'AddProduct'
export default AddProduct