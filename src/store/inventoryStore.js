import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import INITIAL_INVENTORY_DATA from '../Data/inventoryData';

// Zustand store with persistence
const useInventoryStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        curtainTypes: INITIAL_INVENTORY_DATA,
        transactions: [],

        // Get all products in flat format (for sales page, etc.)
        getAllProducts: () => {
          const { curtainTypes } = get();
          return curtainTypes.flatMap(type =>
            type.shapes.flatMap(shape =>
              shape.variants.map(variant => ({
                ...variant,
                shapeId: shape.id,
                shapeName: shape.name,
                typeId: type.id,
                typeName: type.name
              }))
            )
          );
        },

        // Get specific product by IDs
        getProduct: (typeId, shapeId, variantId) => {
          const { curtainTypes } = get();
          const type = curtainTypes.find(t => t.id === typeId);
          if (!type) return null;
          const shape = type.shapes.find(s => s.id === shapeId);
          if (!shape) return null;
          return shape.variants.find(v => v.id === variantId) || null;
        },

        // Update variant inventory (inStock and sold)
        updateVariantInventory: (typeId, shapeId, variantId, inStock, sold) => {
          set(state => {
            const newTypes = JSON.parse(JSON.stringify(state.curtainTypes));
            const type = newTypes.find(t => t.id === typeId);
            if (!type) return state;
            const shape = type.shapes.find(s => s.id === shapeId);
            if (!shape) return state;
            const variant = shape.variants.find(v => v.id === variantId);
            if (variant) {
              variant.inStock = Math.max(0, inStock);
              variant.sold = Math.max(0, sold);
            }
            return { curtainTypes: newTypes };
          });
        },

        // Create a transaction
        addTransaction: (transaction) => {
          const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newTx = {
            ...transaction,
            id,
            date: transaction.date || new Date().toISOString()
          };
          // Auto-cleanup: Enforce 5-month rolling window immediately
          const today = new Date();
          const cutoffDate = new Date(today.getFullYear(), today.getMonth() - 4, 1);
          cutoffDate.setHours(0, 0, 0, 0);

          set(state => {
            const allTx = [...state.transactions, newTx];
            // Filter out old ones
            const filtered = allTx.filter(tx => new Date(tx.date) >= cutoffDate);
            return { transactions: filtered };
          });

          return newTx;
        },

        // Edit a transaction
        editTransaction: (transactionId, updates) => {
          set(state => ({
            transactions: state.transactions.map(tx =>
              tx.id === transactionId ? { ...tx, ...updates, updatedAt: new Date().toISOString() } : tx
            )
          }));
        },

        // Delete a transaction
        deleteTransaction: (transactionId) => {
          set(state => ({
            transactions: state.transactions.filter(tx => tx.id !== transactionId)
          }));
        },

        // Get all transactions for a specific product
        getProductTransactions: (typeId, shapeId, variantId) => {
          const { transactions } = get();
          return transactions.filter(
            tx => tx.typeId === typeId && tx.shapeId === shapeId && tx.variantId === variantId
          );
        },

        // Reset to initial data (for debugging)
        resetInventory: () => {
          set({
            curtainTypes: JSON.parse(JSON.stringify(INITIAL_INVENTORY_DATA)),
            transactions: []
          });
        },

        // Bulk Delete All Transactions with Revert (Optimized)
        deleteAllTransactionsWithRevert: () => {
          set((state) => {
            const newTypes = JSON.parse(JSON.stringify(state.curtainTypes)); // Deep clone
            const allTransactions = state.transactions;

            // Revert effects of each transaction on the newTypes inventory
            allTransactions.forEach(tx => {
              // Find product
              const type = newTypes.find(t => t.id === tx.typeId);
              if (!type) return;
              const shape = type.shapes.find(s => s.id === tx.shapeId);
              if (!shape) return;
              const variant = shape.variants.find(v => v.id === tx.variantId);
              if (!variant) return;

              // Revert Logic
              if (tx.type === 'add') {
                // Undoing an add means removing stock
                const currentStock = variant.inStock || 0;
                variant.inStock = Math.max(0, currentStock - tx.amount);
                // sold doesn't change for add revert
              } else if (tx.type === 'remove' || tx.type === 'sell') {
                // Undoing a remove/sell means adding back to stock and reducing sold count
                const currentStock = variant.inStock || 0;
                const currentSold = variant.sold || 0;
                variant.inStock = currentStock + tx.amount;
                variant.sold = Math.max(0, currentSold - tx.amount);
              }
            });

            return {
              curtainTypes: newTypes,
              transactions: [] // Clear all
            };
          });
        },

        // Optimized Single Delete with Revert
        deleteTransactionAndRevert: (transactionId) => {
          set((state) => {
            const tx = state.transactions.find(t => t.id === transactionId);
            if (!tx) return state; // Transaction not found

            const newTypes = JSON.parse(JSON.stringify(state.curtainTypes));

            // Revert Logic
            const type = newTypes.find(t => t.id === tx.typeId);
            if (type) {
              const shape = type.shapes.find(s => s.id === tx.shapeId);
              if (shape) {
                const variant = shape.variants.find(v => v.id === tx.variantId);
                if (variant) {
                  if (tx.type === 'add') {
                    variant.inStock = Math.max(0, variant.inStock - tx.amount);
                  } else if (tx.type === 'remove' || tx.type === 'sell') {
                    variant.inStock += tx.amount;
                    variant.sold = Math.max(0, variant.sold - tx.amount);
                  }
                }
              }
            }

            return {
              curtainTypes: newTypes,
              transactions: state.transactions.filter(t => t.id !== transactionId)
            };
          });
        },

        // Clean up transactions older than 5 months (Rolling Window)
        cleanupOldTransactions: () => {
          set(state => {
            const today = new Date();
            // We want to keep: Current Month + 4 Previous Months = 5 Months total.
            // Cutoff is the 1st day of the 4th month prior.
            // Example: If today is Dec (12), we want Dec, Nov, Oct, Sep, Aug. Cutoff = Aug 1st.
            const cutoffDate = new Date(today.getFullYear(), today.getMonth() - 4, 1); // 1st day of 4 months ago
            cutoffDate.setHours(0, 0, 0, 0);

            const filteredTransactions = state.transactions.filter(tx => {
              const txDate = new Date(tx.date);
              return txDate >= cutoffDate;
            });

            // Only update if changes are needed to avoid re-renders
            if (filteredTransactions.length === state.transactions.length) {
              return state;
            }

            return { transactions: filteredTransactions };
          });
        }
      }),
      {
        name: 'hamza-inventory-store',
        version: 3,
        migrate: (persistedState, version) => {
          if (version === 0 || version === 1 || version === 2) {
            // Reset to new inventory data structure (new types and shapes)
            return {
              curtainTypes: INITIAL_INVENTORY_DATA,
              transactions: persistedState.transactions || []
            };
          }
          return persistedState;
        }
      }
    )
  )
);

export default useInventoryStore;
