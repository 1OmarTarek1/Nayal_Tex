import { useState, useMemo } from 'react';
import { toWesternDigits } from '../utils';

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
      const typeMatch = filterType === 'all' ||
        (filterType === 'remove' ? (tx.type === 'remove' || tx.type === 'sell') : tx.type === filterType);

      // Match curtain type (case-insensitive and trimmed comparison)
      const curtainTypeMatch = curtainType === 'all' ||
        (tx.typeName && tx.typeName.trim().toLowerCase() === curtainType.trim().toLowerCase());

      // Match color (case-insensitive and trimmed comparison)
      const colorMatch = colorFilter === 'all' ||
        (tx.colorName && tx.colorName.trim().toLowerCase() === colorFilter.trim().toLowerCase());

      // Search across multiple fields (case-insensitive)
      // Convert search term to western digits for numeric fields
      const normalizedSearch = searchTerm.toLowerCase();
      const numericSearch = toWesternDigits(searchTerm);

      const searchMatch = !searchTerm ||
        (tx.productName && tx.productName.toLowerCase().includes(normalizedSearch)) ||
        (tx.colorName && tx.colorName.toLowerCase().includes(normalizedSearch)) ||
        (tx.typeName && tx.typeName.toLowerCase().includes(normalizedSearch)) ||
        (tx.shapeName && tx.shapeName.toLowerCase().includes(normalizedSearch)) ||
        (tx.recipientName && tx.recipientName.toLowerCase().includes(normalizedSearch)) ||
        (tx.recipientPhone && tx.recipientPhone.toString().includes(numericSearch));

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filterType, curtainType, colorFilter, searchTerm, dateSort, quantitySort, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

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
    filteredTransactions, // Keep full list for stats if needed
    paginatedTransactions, // Export paginated list for table
    uniqueColors,
    stats,
    filteredTotal,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage
  };
};
