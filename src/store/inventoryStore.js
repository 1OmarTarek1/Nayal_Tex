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
          set(state => ({
            transactions: [...state.transactions, newTx]
          }));
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
        }
      }),
      {
        name: 'hamza-inventory-store',
        version: 2,
        migrate: (persistedState, version) => {
          if (version === 0 || version === 1) {
            // If version is old, reset to initial data to fix image paths
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
