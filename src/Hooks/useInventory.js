import useInventoryStore from '../store/inventoryStore';

/**
 * Hook to add a product (add to stock)
 * @param {string} typeId - Curtain type ID
 * @param {string} shapeId - Shape ID
 * @param {string} variantId - Variant/color ID
 * @param {number} amount - Quantity to add
 * @returns {function} - Function to execute the add action
 */
export const useAddProduct = () => {
  const { getProduct, updateVariantInventory, addTransaction, curtainTypes } = useInventoryStore();

  const addProduct = (typeId, shapeId, variantId, amount, metadata = {}) => {
    if (amount <= 0) {
      console.warn('Amount must be positive');
      return;
    }

    const product = getProduct(typeId, shapeId, variantId);
    if (!product) {
      console.error('Product not found');
      return;
    }

    // Find type and shape names
    const type = curtainTypes.find(t => t.id === typeId);
    const shape = type?.shapes.find(s => s.id === shapeId);

    const newInStock = product.inStock + amount;
    updateVariantInventory(typeId, shapeId, variantId, newInStock, product.sold);

    // Create transaction with complete product info
    addTransaction({
      typeId,
      shapeId,
      variantId,
      type: 'add',
      amount,
      date: new Date().toISOString(),
      // Product details
      typeName: type?.name || 'Unknown',
      shapeName: shape?.name || 'Unknown',
      productName: product.name || 'Unknown',
      colorName: product.name || 'Unknown',
      colorCode: product.code || '#000000',
      // Metadata (buyer info, notes, etc.)
      recipientName: metadata.name || 'المسئول',
      recipientPhone: metadata.phone || null,
      note: metadata.note || `تم إضافة ${amount} قطعة`
    });
  };

  return addProduct;
};

/**
 * Hook to remove a product (mark as sold)
 * @returns {function} - Function to execute the remove action
 */
export const useRemoveProduct = () => {
  const { getProduct, updateVariantInventory, addTransaction, curtainTypes } = useInventoryStore();

  const removeProduct = (typeId, shapeId, variantId, amount, metadata = {}) => {
    if (amount <= 0) {
      console.warn('Amount must be positive');
      return;
    }

    const product = getProduct(typeId, shapeId, variantId);
    if (!product) {
      console.error('Product not found');
      return;
    }

    if (product.inStock < amount) {
      console.error('Insufficient stock');
      return;
    }

    // Find type and shape names
    const type = curtainTypes.find(t => t.id === typeId);
    const shape = type?.shapes.find(s => s.id === shapeId);

    const newInStock = product.inStock - amount;
    const newSold = product.sold + amount;
    updateVariantInventory(typeId, shapeId, variantId, newInStock, newSold);

    // Create transaction with complete product info
    addTransaction({
      typeId,
      shapeId,
      variantId,
      type: 'remove',
      amount,
      date: new Date().toISOString(),
      // Product details
      typeName: type?.name || 'Unknown',
      shapeName: shape?.name || 'Unknown',
      productName: product.name || 'Unknown',
      colorName: product.name || 'Unknown',
      colorCode: product.code || '#000000',
      // Metadata (buyer info, notes, etc.)
      recipientName: metadata.name || 'المسئول',
      recipientPhone: metadata.phone || null,
      note: metadata.note || `تم بيع ${amount} قطعة إلى ${metadata.name || 'غير معروف'}`
    });
  };

  return removeProduct;
};

/**
 * Hook to manage transactions
 * @returns {object} - Functions to create, edit, delete transactions
 */
export const useTransactions = () => {
  const store = useInventoryStore();

  const modifyTransaction = (transactionId, newAmount, metadata = {}) => {
    const { transactions, getProduct, updateVariantInventory, editTransaction } = store;
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) {
      throw new Error('لم يتم العثور على العملية');
    }

    if (newAmount <= 0) {
      throw new Error('يجب أن تكون الكمية رقمًا موجبًا');
    }

    const product = getProduct(tx.typeId, tx.shapeId, tx.variantId);
    if (!product) throw new Error('لم يتم العثور على المنتج');

    const oldAmount = tx.amount;
    const delta = newAmount - oldAmount;

    if (tx.type === 'add') {
      // adding more increases inStock, decreasing reduces inStock
      const newInStock = product.inStock + delta;
      if (newInStock < 0) throw new Error('لا يمكن أن يكون المخزون الناتج بالسالب');
      updateVariantInventory(tx.typeId, tx.shapeId, tx.variantId, newInStock, product.sold);
    } else if (tx.type === 'remove') {
      // removing more decreases inStock and increases sold
      if (delta > 0 && product.inStock < delta) {
        throw new Error('مخزون غير كاف لزيادة الكمية المُزالة');
      }
      const newInStock = product.inStock - delta;
      const newSold = product.sold + delta;
      if (newInStock < 0 || newSold < 0) throw new Error('قيم المخزون/المبيعات الناتجة غير صالحة');
      updateVariantInventory(tx.typeId, tx.shapeId, tx.variantId, newInStock, newSold);
    }

    // update the transaction record
    editTransaction(transactionId, {
      amount: newAmount,
      ...metadata
    });
  };

  const deleteTransactionWithRevert = (transactionId) => {
    // Optimized Atomic Store Call
    store.deleteTransactionAndRevert(transactionId);
  };

  return {
    addTransaction: store.addTransaction,
    editTransaction: store.editTransaction,
    deleteTransaction: store.deleteTransaction,
    getProductTransactions: store.getProductTransactions,
    getAllTransactions: () => store.transactions,
    modifyTransaction,
    deleteTransactionWithRevert
  };
};

/**
 * Hook to get product by ID
 * @returns {function} - Function to get product
 */
export const useGetProduct = () => {
  return useInventoryStore(state => state.getProduct);
};

/**
 * Hook to get all products in flat format
 * @returns {function} - Function to get all products
 */
export const useGetAllProducts = () => {
  return useInventoryStore(state => state.getAllProducts);
};

/**
 * Hook to get curtain types
 * @returns {array} - Curtain types array
 */
export const useCurtainTypes = () => {
  return useInventoryStore(state => state.curtainTypes);
};

/**
 * Hook to update variant inventory manually
 * @returns {function} - Function to update inventory
 */
export const useUpdateVariantInventory = () => {
  return useInventoryStore(state => state.updateVariantInventory);
};

/**
 * Hook to get all transactions
 * @returns {array} - All transactions
 */
export const useAllTransactions = () => {
  return useInventoryStore(state => state.transactions);
};

/**
 * Hook to reset inventory (debugging)
 * @returns {function} - Function to reset
 */
export const useResetInventory = () => {
  return useInventoryStore(state => state.resetInventory);
};
