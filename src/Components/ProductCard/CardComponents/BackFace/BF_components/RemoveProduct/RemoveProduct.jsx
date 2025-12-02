import { useState, forwardRef, useImperativeHandle } from 'react'
import { useRemoveProduct } from '../../../../../../hooks/useInventory'
import useInventoryStore from '../../../../../../store/inventoryStore'
import Toast from '../../../../../Toast/Toast'
import './RemoveProduct.css'

const RemoveProduct = forwardRef(({ allData, onSubmit, selectedVariantIndex = 0 }, ref) => {
    const [count, setCount] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [toast, setToast] = useState(null)
    const removeProduct = useRemoveProduct()
    const variant = allData?.variants?.[selectedVariantIndex]

    const showToast = (message, type = 'error') => {
        setToast({ message, type })
    }

    const validatePhone = (phoneStr) => {
        return phoneStr.replace(/\D/g, '').length >= 8
    }

    const validateAndSubmit = () => {
        const qty = parseInt(count, 10)
        
        if (!count || count.trim() === '') {
            showToast('الرجاء إدخال الكمية', 'warning')
            return
        }
        
        if (isNaN(qty) || qty <= 0) {
            showToast('الكمية يجب أن تكون رقم موجب', 'error')
            return
        }

        if (!variant) {
            showToast('لم يتم العثور على اللون', 'error')
            return
        }
        
        if (variant.inStock < qty) {
            showToast(`المخزون غير كافي! المتوفر: ${variant.inStock}`, 'error')
            return
        }
        
        if (!name || name.trim() === '') {
            showToast('الرجاء إدخال اسم المستلم', 'warning')
            return
        }
        
        if (name.trim().length < 2) {
            showToast('اسم المستلم يجب أن يكون أطول من حرفين', 'error')
            return
        }
        
        if (!phone || phone.trim() === '') {
            showToast('الرجاء إدخال رقم الهاتف', 'warning')
            return
        }
        
        if (!validatePhone(phone)) {
            showToast('رقم الهاتف غير صحيح (يجب أن يكون 8 أرقام على الأقل)', 'error')
            return
        }

        // Pass metadata with the transaction
        removeProduct(allData.typeId, allData.id, variant.id, qty, { 
            name: name.trim(), 
            phone: phone.trim()
        })
        showToast(`تم إزالة ${qty} وحدة من المخزون بنجاح`, 'success')
        setCount('')
        setName('')
        setPhone('')
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
        <div className="formContent">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="formGroup">
                <input
                    id='countInput'
                    className='formInput'
                    type="number"
                    placeholder="الكمية"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    min="1"
                />
                <input
                    id='nameInput'
                    className='formInput'
                    type="text"
                    placeholder="اسم المستلم"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength="50"
                />
                <input
                    id='numInput'
                    className='formInput'
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={(e) => {
                        const numbersOnly = e.target.value.replace(/\D/g, '')
                        setPhone(numbersOnly)
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    maxLength="15"
                    style={{direction:"rtl"}}
                    inputMode="numeric"
                />
            </div>
            {/* {variant && <p style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>المخزون المتوفر: {variant.inStock}</p>} */}
        </div>
    )
})

RemoveProduct.displayName = 'RemoveProduct'
export default RemoveProduct