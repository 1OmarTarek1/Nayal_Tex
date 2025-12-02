import React from 'react';
import './TransactionSummary.css';

const TransactionSummary = ({ stats }) => {
  return (
    <div className="summaryCards">
      <div className="summaryCard">
        <div className="summaryLabel">إجمالي العمليات</div>
        <div className="summaryValue">{stats.transactions}</div>
      </div>
      <div className="summaryCard added">
        <div className="summaryLabel">المضافة</div>
        <div className="summaryValue">{stats.added}</div>
      </div>
      <div className="summaryCard removed">
        <div className="summaryLabel">المباعة</div>
        <div className="summaryValue">{stats.removed}</div>
      </div>
    </div>
  );
};

export default TransactionSummary;
