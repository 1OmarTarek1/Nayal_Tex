import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DynamicNav, MainContainer } from '../../Layouts';
import useInventoryStore from '../../store/inventoryStore';
import { useTransactions } from '../../Hooks/useInventory.js';
import { Toast } from '../../Layouts';
import { toArabicDigits } from '../../utils/numbers';
import './TransactionHistoryPage.css';

// Components
import TransactionSummary from '../../Components/TransactionHistoryPageCom/TransactionSummary/TransactionSummary';
import TransactionFilters from '../../Components/TransactionHistoryPageCom/TransactionFilters/TransactionFilters';
import TransactionTable from '../../Components/TransactionHistoryPageCom/TransactionTable/TransactionTable';
import UndoSnackbar from '../../Components/TransactionHistoryPageCom/UndoSnackbar/UndoSnackbar';

// Hooks
import { useTransactionFilters } from '../../Hooks/useTransactionFilters';
import { useTransactionActions } from '../../Hooks/useTransactionActions';

const TransactionHistoryPage = () => {
  const transactions = useInventoryStore(state => state.transactions);
  const curtainTypes = useInventoryStore(state => state.curtainTypes);
  const { modifyTransaction, deleteTransactionWithRevert } = useTransactions();
  const addTransaction = useInventoryStore(state => state.addTransaction);
  const updateVariantInventory = useInventoryStore(state => state.updateVariantInventory);
  const getProduct = useInventoryStore(state => state.getProduct);

  const [pageToast, setPageToast] = useState(null);

  const {
    filterType, setFilterType,
    curtainType, setCurtainType,
    colorFilter, setColorFilter,
    searchTerm, setSearchTerm,
    dateSort, setDateSort,
    quantitySort, setQuantitySort,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    clearAllFilters,
    filteredTransactions,
    uniqueColors,
    stats,
    filteredTotal
  } = useTransactionFilters(transactions);

  const {
    undoBuffer,
    undoCountdown,
    deleteAllOpen,
    setDeleteAllOpen,
    handleDeleteConfirmed,
    handleDeleteAllConfirmed,
    handleUndo,
    handleEditConfirmed,
    closeUndo
  } = useTransactionActions(
    transactions,
    deleteTransactionWithRevert,
    addTransaction,
    updateVariantInventory,
    getProduct,
    modifyTransaction,
    setPageToast
  );

  const formatDatePart = useCallback((isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Array of Arabic day names
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayName = days[date.getDay()];

    return `${dayName}\u00A0\u00A0-\u00A0\u00A0${toArabicDigits(day)} / ${toArabicDigits(month)} /  ${toArabicDigits(year)}`;
  }, []);

  const formatTimePart = useCallback((isoString) => {
    const date = new Date(isoString);
    // 12-hour time with AM/PM; map AM/PM to Arabic letters
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // e.g. 02:34 PM
    // split time and period
    const parts = timeStr.split(' ');
    let timePart = parts[0];
    const period = (parts[1] || '').toUpperCase();
    const arabicPeriod = period === 'AM' ? 'ص' : period === 'PM' ? 'م' : parts[1] || '';
    return `${toArabicDigits(timePart)} ${arabicPeriod}`; // e.g. ٠٢:٣٤ م
  }, []);

  const getTypeLabel = useCallback((type) => {
    return type === 'add' ? 'إضافة' : 'سحـب';
  }, []);

  const getTypeClass = useCallback((type) => {
    return type === 'add' ? 'type-add' : 'type-remove';
  }, []);

  return (
    <>
      {pageToast && createPortal(
        <Toast message={pageToast.message} type={pageToast.type} onClose={() => setPageToast(null)} />,
        document.body
      )}
      {/* <DynamicNav className="transactionPageNav" title="سجل العمليات" /> */}
      <MainContainer>
        <div className="PAGE transactionHistoryPage">

          <TransactionSummary stats={stats} />

          <TransactionFilters
            filterType={filterType}
            setFilterType={setFilterType}
            curtainType={curtainType}
            setCurtainType={setCurtainType}
            colorFilter={colorFilter}
            setColorFilter={setColorFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateSort={dateSort}
            setDateSort={setDateSort}
            quantitySort={quantitySort}
            setQuantitySort={setQuantitySort}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            curtainTypes={curtainTypes}
            uniqueColors={uniqueColors}
            onClearFilters={clearAllFilters}
            onDeleteAll={() => setDeleteAllOpen(true)}
          />

          <TransactionTable
            transactions={filteredTransactions}
            filteredTotal={filteredTotal}
            totalTransactions={stats.transactions}
            formatDate={formatDatePart}
            formatTime={formatTimePart}
            getTypeLabel={getTypeLabel}
            getTypeClass={getTypeClass}
            onDeleteConfirmed={handleDeleteConfirmed}
            onEditConfirmed={handleEditConfirmed}
          />

          {/* Delete All Confirmation Modal */}
          {deleteAllOpen && (
            <div className="modalOverlay" onClick={() => setDeleteAllOpen(false)}>
              <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h3>تأكيد حذف الكل</h3>
                <p>هل أنت متأكد من حذف جميع العمليات؟ هذا سيؤدي لإرجاع المخزون لحالته قبل هذه العمليات.</p>
                <div style={{ textAlign: 'right', marginTop: 12, display: "flex", gap: 5 }}>
                  <button className="actionBtn danger" onClick={handleDeleteAllConfirmed}>نعم، احذف الكل</button>
                  <button className="actionBtn" onClick={() => setDeleteAllOpen(false)}>إلغاء</button>
                </div>
              </div>
            </div>
          )}

          <UndoSnackbar
            undoBuffer={undoBuffer}
            undoCountdown={undoCountdown}
            onUndo={handleUndo}
            onClose={closeUndo}
          />
        </div>
      </MainContainer>
    </>
  );
};

export default TransactionHistoryPage;
