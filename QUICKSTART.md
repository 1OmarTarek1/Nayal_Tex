# Quick Start - Inventory System

## Installation

Zustand already installed. If not:
```bash
npm install zustand --legacy-peer-deps
```

## File Locations

```
src/
├── store/inventoryStore.js     # State management
├── hooks/useInventory.js       # Custom hooks
└── [components use hooks]
```

## How It Works

### 1. Store (Single Source of Truth)
All data lives in `src/store/inventoryStore.js`:
- Initial data: `INITIAL_INVENTORY_DATA`
- Actions: `updateVariantInventory()`, `addTransaction()`, etc.
- Persistence: Auto-saves to localStorage

### 2. Hooks (Business Logic)
Import from `src/hooks/useInventory.js`:
```javascript
const { useAddProduct, useRemoveProduct, useCurtainTypes } = require('./hooks/useInventory');
```

### 3. Components (UI Layer)
Components use hooks to read/write data:
```javascript
const curtainTypes = useCurtainTypes();  // Read
const addProduct = useAddProduct();      // Write
addProduct(typeId, shapeId, variantId, quantity);
```

## Common Tasks

### Add Items to Stock
```javascript
import { useAddProduct } from '../hooks/useInventory';

const { amount } = formData;
const addProduct = useAddProduct();
addProduct('type1', 'shape-1', 'gold', amount);
// ✓ inStock increases
// ✓ Transaction created
// ✓ Saved to localStorage
// ✓ All cards update
```

### Sell Items
```javascript
import { useRemoveProduct } from '../hooks/useInventory';

const removeProduct = useRemoveProduct();
removeProduct('type1', 'shape-1', 'gold', 5);
// ✓ inStock decreases
// ✓ sold increases
// ✓ Transaction logged
```

### Get All Inventory
```javascript
import { useCurtainTypes } from '../hooks/useInventory';

const curtainTypes = useCurtainTypes();
// Returns: [{ id, name, shapes: [{ id, name, variants: [...] }] }]
```

### Get Flat Product List
```javascript
import { useGetAllProducts } from '../hooks/useInventory';

const getAllProducts = useGetAllProducts();
const products = getAllProducts();
// Returns: [{ id, name, inStock, sold, shapeId, typeId, ... }]
```

### Subscribe to Real-Time Changes
```javascript
import useInventoryStore from '../store/inventoryStore';

const CardContent = ({ allData, selectedVariantIndex }) => {
  const variant = useInventoryStore(state => {
    const type = state.curtainTypes.find(t => t.id === allData?.typeId);
    const shape = type?.shapes.find(s => s.id === allData?.id);
    return shape?.variants?.[selectedVariantIndex];
  });
  
  // Component re-renders whenever inStock or sold changes
  return <div>{variant?.inStock}</div>;
};
```

## Debugging

### Check Store State
```javascript
// Browser console
import useInventoryStore from '../store/inventoryStore';
const state = useInventoryStore.getState();
console.log(state.curtainTypes);
console.log(state.transactions);
```

### Check localStorage
```javascript
// Browser console
JSON.parse(localStorage.getItem('hamza-inventory-store'));
```

### Redux DevTools
Install Redux DevTools browser extension to see all state changes in real-time.

## Testing

### Add Items (Add button)
1. Click **Add** on any card
2. Enter quantity: `10`
3. Click **Save**
4. Inventory updates instantly
5. Refresh page → Data persists ✓

### Sell Items (Remove button)
1. Click **Remove** on any card
2. Enter quantity: `5`, Buyer: "أحمد", Phone: "0501234567"
3. Click **Save**
4. inStock decreases, sold increases ✓
5. Transaction logged ✓

### Data Persistence
1. Add/remove items
2. Refresh page (`F5`)
3. Numbers should stay the same ✓
4. No random data generation ✓

## Troubleshooting

### Data lost after refresh
```javascript
// Check localStorage exists
localStorage.getItem('hamza-inventory-store')  // Should not be null

// Reset if corrupted
localStorage.removeItem('hamza-inventory-store');
location.reload();
```

### Numbers not updating
1. Check `CardContent` is using store selector
2. Verify hook is called in component
3. Open Redux DevTools to see state changes

### Component not re-rendering
1. Ensure using Zustand selector hook
2. Don't use `useInventoryStore.getState()` in render
3. Use subscription pattern: `useInventoryStore(state => ...)`

## File Checklist

✅ Created files:
- `src/store/inventoryStore.js` - Zustand store with full data + actions
- `src/hooks/useInventory.js` - Custom hooks for CRUD
- `ARCHITECTURE.md` - Full documentation

✅ Updated files:
- `src/Pages/InventoryPage/InventoryPage.jsx` - Uses `useCurtainTypes()`
- `src/Components/ProductCard/ProductCard.jsx` - Passes `allData` to forms
- `src/Components/ProductCard/CardComponents/BackFace/BackFace.jsx` - Receives data
- `src/Components/ProductCard/CardComponents/BackFace/BF_components/AddProduct/AddProduct.jsx` - Calls `useAddProduct()`
- `src/Components/ProductCard/CardComponents/BackFace/BF_components/RemoveProduct/RemoveProduct.jsx` - Calls `useRemoveProduct()`
- `src/Components/ProductCard/CardComponents/FrontFace/FF_components/CardContent/CardContent.jsx` - **Subscribes to store**

## Next Steps

1. **Test the app**
   ```bash
   npm run dev
   ```

2. **Add items via forms** - Click Add/Remove buttons

3. **Check persistence** - Refresh page, data should persist

4. **Monitor transactions** - Create SalesPage component using `useAllTransactions()`

5. **Add more features** - Edit transactions, analytics, reports, etc.

## API Reference

### Store Actions

```javascript
store.updateVariantInventory(typeId, shapeId, variantId, inStock, sold)
store.addTransaction(transaction)
store.editTransaction(transactionId, updates)
store.deleteTransaction(transactionId)
```

### Store Queries

```javascript
store.getProduct(typeId, shapeId, variantId)
store.getAllProducts()
store.getProductTransactions(typeId, shapeId, variantId)
```

### Hooks

```javascript
useAddProduct()              // (typeId, shapeId, variantId, amount) => void
useRemoveProduct()           // (typeId, shapeId, variantId, amount) => void
useCurtainTypes()            // () => array
useGetProduct()              // (typeId, shapeId, variantId) => object
useGetAllProducts()          // () => array
useAllTransactions()         // () => array
useTransactions()            // { add, edit, delete, getProductTransactions }
useUpdateVariantInventory()  // (typeId, shapeId, variantId, inStock, sold) => void
useResetInventory()          // () => void
```

---

**Your inventory system is ready! 🚀**
