import React from 'react';
import { toArabicDigits } from '../../../utils/numbers';
import './UndoSnackbar.css';

const UndoSnackbar = ({ undoBuffer, undoCountdown, onUndo, onClose }) => {
    if (!undoBuffer || !undoBuffer.txs || undoBuffer.txs.length === 0) return null;

    return (
        <div className="undoSnackbar" role="status">
            <div className="undoMessage">تم حذف {undoBuffer.txs.length} عملية</div>
            <div className="undoCountdown">{toArabicDigits(undoCountdown)}ث</div>
            <div className="undoActions">
                <button className="actionBtn" onClick={onUndo}>تراجع</button>
                <button className="actionBtn" onClick={onClose}>إغلاق</button>
            </div>
        </div>
    );
};

export default UndoSnackbar;
