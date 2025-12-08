import { useState, useEffect } from 'react';
import useInventoryStore from '../store/inventoryStore';

export const useTransactionActions = (
  transactions,
  deleteTransactionWithRevert,
  addTransaction,
  updateVariantInventory,
  getProduct,
  modifyTransaction,
  setPageToast
) => {
  const [undoBuffer, setUndoBuffer] = useState(null); // { txs: [], timeoutId }
  const [undoCountdown, setUndoCountdown] = useState(0); // remaining seconds for undo
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  // Update countdown every second when undo buffer is active
  useEffect(() => {
    if (!undoBuffer?.txs) return;
    const interval = setInterval(() => {
      setUndoCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [undoBuffer?.txs]);

  // Handler when a row confirms deletion — performs delete + appends to undo buffer
  const handleDeleteConfirmed = async (tx) => {
    try {
      const deletedCopy = { ...tx };
      await deleteTransactionWithRevert(tx.id);

      // clear previous timeout if any
      if (undoBuffer?.timeoutId) clearTimeout(undoBuffer.timeoutId);

      const timeoutId = setTimeout(() => {
        setUndoBuffer(null);
      }, 8000);

      setUndoBuffer(prev => ({ txs: [...(prev?.txs || []), deletedCopy], timeoutId }));
      setUndoCountdown(8);
      setPageToast({ message: 'تم حذف العملية. يمكنك التراجع خلال 8 ثوانٍ.', type: 'success', duration: 3000 });
    } catch (err) {
      setPageToast({ message: err.message || 'خطأ أثناء حذف العملية', type: 'error' });
      throw err;
    }
  };

  const deleteAllTransactionsWithRevert = useInventoryStore(state => state.deleteAllTransactionsWithRevert);

  const handleDeleteAllConfirmed = () => {
    // Optimized Bulk Delete
    try {
      // Create a snapshot for undo (optional, if memory allows)
      // For very large datasets, we might want to skip undo or limit it, 
      // but for ~500-1000 items it should be fine to store in memory for a few seconds.
      const deletedSnapshot = [...transactions];

      // Execute optimized store action
      deleteAllTransactionsWithRevert();

      if (deletedSnapshot.length > 0) {
        if (undoBuffer?.timeoutId) clearTimeout(undoBuffer.timeoutId);
        const timeoutId = setTimeout(() => setUndoBuffer(null), 8000);

        setUndoBuffer({ txs: deletedSnapshot, timeoutId });
        setUndoCountdown(8);
        setPageToast({ message: `تم حذف ${deletedSnapshot.length} عملية. يمكنك التراجع خلال 8 ثوانٍ.`, type: 'success' });
      }
    } catch (err) {
      setPageToast({ message: 'حدث خطأ أثناء حذف العمليات', type: 'error' });
      console.error(err);
    }

    setDeleteAllOpen(false);
  };

  const handleUndo = async () => {
    if (!undoBuffer?.txs?.length) return;
    const { txs, timeoutId } = undoBuffer;
    clearTimeout(timeoutId);
    const readded = [];
    const failed = [];
    for (const tx of txs) {
      try {
        const product = getProduct(tx.typeId, tx.shapeId, tx.variantId) || { inStock: 0, sold: 0 };
        if (tx.type === 'add') {
          const newInStock = (product.inStock || 0) + tx.amount;
          updateVariantInventory(tx.typeId, tx.shapeId, tx.variantId, newInStock, product.sold || 0);
        } else {
          // re-apply remove
          if ((product.inStock || 0) < tx.amount) {
            throw new Error('المخزون الحالي لا يكفي لإعادة العملية');
          }
          const newInStock = (product.inStock || 0) - tx.amount;
          const newSold = (product.sold || 0) + tx.amount;
          updateVariantInventory(tx.typeId, tx.shapeId, tx.variantId, newInStock, newSold);
        }

        addTransaction({
          typeId: tx.typeId,
          shapeId: tx.shapeId,
          variantId: tx.variantId,
          type: tx.type,
          amount: tx.amount,
          date: new Date().toISOString(),
          typeName: tx.typeName,
          shapeName: tx.shapeName,
          productName: tx.productName,
          colorName: tx.colorName,
          colorCode: tx.colorCode,
          recipientName: tx.recipientName,
          recipientPhone: tx.recipientPhone,
          note: tx.note
        });
        readded.push(tx);
      } catch (err) {
        failed.push({ tx, err });
      }
    }

    if (readded.length > 0) setPageToast({ message: `تم التراجع عن ${readded.length} عملية`, type: 'success' });
    if (failed.length > 0) setPageToast({ message: `فشل التراجع عن ${failed.length} عملية`, type: 'error' });
    setUndoBuffer(null);
    setUndoCountdown(0);
  };

  const handleEditConfirmed = async (tx, newQty, metadata = {}) => {
    try {
      await modifyTransaction(tx.id, newQty, metadata);
      setPageToast({ message: 'تم تعديل العملية بنجاح', type: 'success' });
    } catch (err) {
      setPageToast({ message: err.message || 'خطأ أثناء تعديل العملية', type: 'error' });
      throw err;
    }
  };

  const closeUndo = () => {
    if (undoBuffer?.timeoutId) clearTimeout(undoBuffer.timeoutId);
    setUndoBuffer(null);
    setUndoCountdown(0);
  };

  return {
    undoBuffer,
    undoCountdown,
    deleteAllOpen,
    setDeleteAllOpen,
    handleDeleteConfirmed,
    handleDeleteAllConfirmed,
    handleUndo,
    handleEditConfirmed,
    closeUndo
  };
};
