import React from 'react';
import TransactionRow from '../TransactionRow/TransactionRow';
import { toArabicDigits } from '../../../utils/numbers';
import './TransactionTable.css';

const TransactionTable = ({
    transactions,
    filteredTotal,
    totalTransactions,
    formatDate,
    formatTime,
    getTypeLabel,
    getTypeClass,
    onDeleteConfirmed,
    onEditConfirmed
}) => {
    return (
        <>
            <div className="tableContainer">
                {transactions.length === 0 ? (
                    <div className="noTransactions">
                        <p>لا توجد عمليات حالياً</p>
                    </div>
                ) : (
                    <table className="transactionsTable">
                        <thead>
                            <tr>
                                <th>م</th>
                                <th>التاريخ</th>
                                <th>الوقت</th>
                                <th>اسم العميل</th>
                                <th>رقم الهاتف</th>
                                <th>نوع العملية</th>
                                <th>النوع</th>
                                <th>الشكل</th>
                                <th>اللون</th>
                                <th>الكمية</th>
                                <th>إجـــــــــــراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, idx) => (
                                <TransactionRow
                                    key={tx.id}
                                    serial={toArabicDigits(idx + 1)}
                                    tx={tx}
                                    formatDate={formatDate}
                                    formatTime={formatTime}
                                    getTypeLabel={getTypeLabel}
                                    getTypeClass={getTypeClass}
                                    onDeleteConfirmed={onDeleteConfirmed}
                                    onEditConfirmed={onEditConfirmed}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {transactions.length > 0 && (
                <div className="resultsSummary">
                    <p>
                        عرض <strong>{transactions.length}</strong> من <strong>{totalTransactions}</strong> عملية — الإجمالي: <strong>{filteredTotal}</strong> وحدة
                    </p>
                </div>
            )}
        </>
    );
};

export default TransactionTable;
