import { useState, useMemo } from 'react';

export const useTransactionFilters = (transactions) => {
  const [filterType, setFilterType] = useState('all'); // all, add, remove
  const [curtainType, setCurtainType] = useState('all'); // all, type1, type2, ...
  const [colorFilter, setColorFilter] = useState('all'); // all, color1, color2, ...
  const [searchTerm, setSearchTerm] = useState('');
  const [dateSort, setDateSort] = useState('desc'); // 'desc' for newest first (default), 'asc' for oldest first
  const [quantitySort, setQuantitySort] = useState('none'); // 'none', 'desc', or 'asc'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Function to clear all filters
  const clearAllFilters = () => {
    setFilterType('all');
    setCurtainType('all');
    setColorFilter('all');
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setDateSort('desc');
    setQuantitySort('none');
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => {
      // Match transaction type (add/remove)
      const typeMatch = filterType === 'all' || tx.type === filterType;

      // Match curtain type (case-insensitive and trimmed comparison)
      const curtainTypeMatch = curtainType === 'all' ||
        (tx.typeName && tx.typeName.trim().toLowerCase() === curtainType.trim().toLowerCase());

      // Match color (case-insensitive and trimmed comparison)
      const colorMatch = colorFilter === 'all' ||
        (tx.colorName && tx.colorName.trim().toLowerCase() === colorFilter.trim().toLowerCase());

      // Search across multiple fields (case-insensitive)
      const searchMatch = !searchTerm ||
        (tx.productName && tx.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.colorName && tx.colorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.typeName && tx.typeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.shapeName && tx.shapeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.recipientName && tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Date range filtering
      let dateMatch = true;
      if (dateFrom || dateTo) {
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);

        if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          dateMatch = dateMatch && txDate >= fromDate;
        }
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && txDate <= toDate;
        }
      }

      return typeMatch && curtainTypeMatch && colorMatch && searchMatch && dateMatch;
    });

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
    });

    if (quantitySort !== 'none') {
      result.sort((a, b) => {
        return quantitySort === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      });
    }

    return result;
  }, [transactions, filterType, searchTerm, dateSort, quantitySort, curtainType, colorFilter, dateFrom, dateTo]);

  // Get unique colors from transactions (case-insensitive and sorted)
  const uniqueColors = useMemo(() => {
    const colors = new Map();
    transactions.forEach(tx => {
      if (tx.colorName) {
        const normalizedColor = tx.colorName.trim();
        if (normalizedColor && !colors.has(normalizedColor.toLowerCase())) {
          colors.set(normalizedColor.toLowerCase(), normalizedColor);
        }
      }
    });
    return Array.from(colors.values()).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  // Summary statistics
  const stats = useMemo(() => {
    const added = transactions.filter(tx => tx.type === 'add').reduce((sum, tx) => sum + tx.amount, 0);
    const removed = transactions.filter(tx => tx.type === 'remove').reduce((sum, tx) => sum + tx.amount, 0);
    return { added, removed, total: added + removed, transactions: transactions.length };
  }, [transactions]);

  const filteredTotal = useMemo(() => {
    return filteredTransactions.reduce((s, tx) => s + (tx.amount || 0), 0);
  }, [filteredTransactions]);

  return {
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
  };
};
