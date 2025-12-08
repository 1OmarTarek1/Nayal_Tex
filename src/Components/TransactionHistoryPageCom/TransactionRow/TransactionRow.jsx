import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import useInventoryStore from '../../../store/inventoryStore';
import { Toast } from '../../../Layouts';
import { toArabicDigits } from '../../../utils/numbers';
import './TransactionRow.css';

const Modal = ({ children, onClose }) => {
    return createPortal(
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
};

const TransactionRow = ({ serial, tx, formatDate, formatTime, getTypeLabel, getTypeClass, onDeleteConfirmed, onEditConfirmed }) => {
    const getProduct = useInventoryStore(state => state.getProduct);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [newAmount, setNewAmount] = useState(tx.amount.toString());
    const [recipientName, setRecipientName] = useState('');
    const [recipientPhone, setRecipientPhone] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmEditOpen, setConfirmEditOpen] = useState(false);

    const product = getProduct(tx.typeId, tx.shapeId, tx.variantId) || {};

    const handleView = () => setViewOpen(true);
    const handleEditOpen = () => {
        setNewAmount(String(tx.amount));
        setRecipientName(tx.recipientName || '');
        setRecipientPhone(tx.recipientPhone || '');
        setEditOpen(true);
    };

    const handleDeleteRequest = () => {
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setConfirmDeleteOpen(false);
        try {
            if (onDeleteConfirmed) {
                await onDeleteConfirmed(tx);
            }
        } catch (err) {
            setToast({ message: err.message || 'خطأ أثناء حذف العملية', type: 'error' });
        }
    };

    const submitEdit = () => {
        const qty = parseInt(newAmount, 10);
        if (isNaN(qty) || qty <= 0) {
            setToast({ message: 'الكمية يجب أن تكون رقم موجب', type: 'error' });
            return;
        }
        // open confirmation for edit
        setConfirmEditOpen(true);
    };

    const confirmEdit = async () => {
        setConfirmEditOpen(false);
        const qty = parseInt(newAmount, 10);
        try {
            if (onEditConfirmed) {
                const metadata = {};
                if (tx.type === 'remove' || tx.type === 'sell') {
                    metadata.recipientName = recipientName;
                    metadata.recipientPhone = recipientPhone;
                }
                await onEditConfirmed(tx, qty, metadata);
            }
            setToast({ message: 'تم تعديل العملية بنجاح', type: 'success' });
            setEditOpen(false);
        } catch (err) {
            setToast({ message: err.message || 'خطأ أثناء تعديل العملية', type: 'error' });
        }
    };

    return (
        <>
            {toast && createPortal(
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />,
                document.body
            )}
            <tr>
                <td className="serialCell">{serial}</td>
                <td className="dateCell">{formatDate(tx.date)}</td>
                <td className="timeCell">{formatTime(tx.date)}</td>
                <td>{tx.recipientName || '-'}</td>
                <td>{tx.recipientPhone ? toArabicDigits(tx.recipientPhone) : '-'}</td>
                <td className={`typeCell ${getTypeClass(tx.type)}`}><span className="typeBadge">{getTypeLabel(tx.type)}</span></td>
                <td>{tx.typeName}</td>
                <td>{tx.shapeName}</td>
                <td>
                    <div className="colorCell">
                        <span className="colorDot" style={{ backgroundColor: tx.colorCode }} title={tx.colorName}></span>
                        {tx.colorName}
                    </div>
                </td>
                <td className="amountCell"><strong>{toArabicDigits(tx.amount)}</strong></td>
                <td className="actionsCell">
                    <button className="actionTBtn" onClick={handleView}><FaRegEye /></button>
                    <button className="actionTBtn" onClick={handleEditOpen}><FaRegEdit /></button>
                    <button className="actionTBtn danger" onClick={handleDeleteRequest}><FaTrashAlt /></button>
                </td>
            </tr>

            {/* View Modal */}
            {viewOpen && (
                <Modal onClose={() => setViewOpen(false)}>
                    <h3>معلومات المنتج</h3>
                    <div className="productViewRow">
                        <img src={product.image || ''} alt={tx.productName} />
                        <ul className='showDetailsList'>
                            <li><span>النوع</span> <span>{tx.typeName}</span></li>
                            <li><span>الشكل</span> <span>{tx.shapeName}</span></li>
                            <li><span>اللون</span> <span>{tx.colorName}</span></li>
                            <li><span>المخزون</span> <span>{product.inStock ?? '-'}</span></li>
                            <li><span>المباع</span> <span>{product.sold ?? '-'}</span></li>
                        </ul>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: 12 }}>
                        <button className="actionBtn" onClick={() => setViewOpen(false)}>اغلاق</button>
                    </div>
                </Modal>
            )}

            {/* Edit Modal */}
            {editOpen && (
                <Modal onClose={() => setEditOpen(false)}>
                    <h3>تعديل الكمية</h3>
                    <div className="formGroup">
                        <label>الكمية الحالية: <strong>{tx.amount}</strong></label>
                        <input id='userCount' type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} min="1" />
                    </div>
                    {(tx.type === 'remove' || tx.type === 'sell') && (
                        <>
                            <div className="formGroup">
                                <label>اسم العميل:</label>
                                <input
                                    id='userName'
                                    type="text"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    placeholder="اسم العميل"
                                />
                            </div>
                            <div className="formGroup">
                                <label>رقم الهاتف:</label>
                                <input
                                    id='userNum'
                                    type="text"
                                    value={recipientPhone}
                                    onChange={(e) => setRecipientPhone(e.target.value)}
                                    placeholder="رقم الهاتف"
                                />
                            </div>
                        </>
                    )}
                    <div style={{ textAlign: 'right', marginTop: 12, display: 'flex', gap: 5 }}>
                        <button className="actionBtn" onClick={submitEdit}>حفــــــــظ</button>
                        <button className="actionBtn" onClick={() => setEditOpen(false)}>إلغاء</button>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteOpen && (
                <Modal onClose={() => setConfirmDeleteOpen(false)}>
                    <h3>تأكيد الحذف</h3>
                    <p>هل أنت متأكد من أنك تريد حذف هذه العملية؟ سيتم إرجاع المخزون إلى الحالة السابقة.</p>
                    <div style={{ textAlign: 'right', marginTop: 12, display: 'flex', gap: 5 }}>
                        <button className="actionBtn danger" onClick={confirmDelete}>نعم، احذف</button>
                        <button className="actionBtn" onClick={() => setConfirmDeleteOpen(false)}>إلغاء</button>
                    </div>
                </Modal>
            )}

            {/* Edit Confirmation Modal */}
            {confirmEditOpen && (
                <Modal onClose={() => setConfirmEditOpen(false)}>
                    <h3>تأكيد تعديل العملية</h3>
                    <p>هل أنت متأكد من تعديل الكمية من <strong>{tx.amount}</strong> إلى <strong>{newAmount}</strong>؟</p>
                    {(tx.type === 'remove' || tx.type === 'sell') && (
                        <div style={{ marginTop: 8, fontSize: '0.9em', color: '#666' }}>
                            <p>سيتم تحديث بيانات العميل أيضاً.</p>
                        </div>
                    )}
                    <div className='' style={{ textAlign: 'right', marginTop: 12, display: 'flex', gap: 5 }}>
                        <button className="actionBtn" onClick={confirmEdit}>نعم، قم بالتعديل</button>
                        <button className="actionBtn" onClick={() => setConfirmEditOpen(false)}>إلغاء</button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default React.memo(TransactionRow);
