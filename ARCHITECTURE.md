# Hamza Website - Inventory Management Architecture

## Overview

This document explains the complete restructured architecture for the Hamza curtains inventory system. The system uses **Zustand** for centralized state management, **React hooks** for CRUD operations, and **localStorage** for persistence.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Folder Structure](#folder-structure)
3. [Key Components](#key-components)
4. [State Management](#state-management)
5. [Data Flow](#data-flow)
6. [CRUD Operations](#crud-operations)
7. [Transaction System](#transaction-system)
8. [Persistence & localStorage](#persistence--localstorage)
9. [Component Integration](#component-integration)
10. [Usage Examples](#usage-examples)

---

## Architecture Overview

### Design Principles

- **Single Source of Truth**: All inventory data lives in Zustand store
- **No Random Data**: Fixed, immutable initial data that never changes unless explicitly updated
- **Two-Way Binding**: UI updates store, store updates UI in real-time
- **Transaction Logging**: Every add/remove operation is logged for audit trail
- **Persistence**: All changes are saved to localStorage automatically
- **Clean Separation**: Components are dumb presentational, hooks handle logic

### Tech Stack

- **Zustand**: Lightweight, fast state management library
- **React Hooks**: Custom hooks for business logic
- **localStorage**: Browser persistence API
- **React Context**: Optional (can be added for legacy support)

---

## Folder Structure

```
src/
├── store/
│   └── inventoryStore.js          # Zustand store with all state logic
│
├── hooks/
│   └── useInventory.js            # Custom hooks for CRUD & queries
│
├── Components/
│   └── ProductCard/
│       ├── ProductCard.jsx
│       └── CardComponents/
│           ├── FrontFace/
│           │   ├── FrontFace.jsx
│           │   └── FF_components/
│           │       ├── CardContent/
│           │       │   └── CardContent.jsx  (subscribes to store)
│           │       ├── SCBG/
│           │       │   └── SCBG.jsx
│           │       └── InventoryActions/
│           │           └── InventoryActions.jsx
│           └── BackFace/
│               ├── BackFace.jsx
│               └── BF_components/
│                   ├── AddProduct/
│                   │   └── AddProduct.jsx    (calls useAddProduct)
│                   ├── RemoveProduct/
│                   │   └── RemoveProduct.jsx (calls useRemoveProduct)
│                   ├── FormHeader/
│                   │   └── FormHeader.jsx
│                   └── FormFooter/
│                       └── FormFooter.jsx
│
├── Pages/
│   ├── InventoryPage/
│   │   └── InventoryPage.jsx      (uses useCurtainTypes)
│   └── SalesPage/
│       └── SalesPage.jsx           (uses useGetAllProducts, useAllTransactions)
│
└── Data/
    └── inventoryData.jsx           (DEPRECATED - data now in store)
```

---

## Key Components

### 1. **inventoryStore.js** - The Single Source of Truth

```javascript
// State
curtainTypes: [...]  // All inventory data
transactions: [...]  // All transactions

// Actions
updateVariantInventory()  // Update inStock & sold
addTransaction()          // Create transaction
editTransaction()         // Edit transaction
deleteTransaction()       // Delete transaction
getProduct()             // Get specific product
getAllProducts()         // Get flat product list
getProductTransactions() // Get transactions for a product
```

**Key Features**:
- Uses Zustand middleware: `devtools` (Redux DevTools debugging) + `persist` (localStorage)
- All state updates are immutable (deep cloning to prevent mutations)
- localStorage key: `hamza-inventory-store`
- Data persists across browser refresh

### 2. **useInventory.js** - Custom Hooks

All hooks use Zustand selectors to access store:

```javascript
// Product Operations
useAddProduct()                   // Add items to stock
useRemoveProduct()               // Remove items (mark as sold)

// Queries
useCurtainTypes()               // Get all curtain types
useGetProduct()                 // Get specific product
useGetAllProducts()             // Get flat product array

// Transactions
useTransactions()               // CRUD for transactions
useAllTransactions()            // Get all transactions
```

### 3. **ProductCard Components** - Data-Driven UI

#### FrontFace.jsx
- Displays product image and color swatches
- Uses component state for color selection
- **Subscribes to store**: `CardContent` reads live inventory data

#### CardContent.jsx
- **Actively subscribes to store changes**
- Uses Zustand selector to get current variant data
- Re-renders whenever inStock or sold changes
- Shows real-time inventory numbers

#### BackFace.jsx - Forms
- `AddProduct.jsx`: Form to add items to stock
- `RemoveProduct.jsx`: Form to record sales
- Both call store actions via hooks

---

## State Management

### Zustand Store Architecture

```javascript
// Initial Data (fixed, no randomization)
const INITIAL_INVENTORY_DATA = [
  {
    id: 'type1',
    name: 'رومانية',
    shapes: [
      {
        id: 'shape-1',
        name: 'شكل 1',
        variants: [
          { id: 'gold', name: 'ذهبي', inStock: 39, sold: 10 },
          { id: 'green', name: 'أخضر', inStock: 18, sold: 11 },
          // ...
        ]
      },
      // ...
    ]
  },
  // ...
]

// Zustand Store
const useInventoryStore = create(
  devtools(
    persist(
      (set, get) => ({
        curtainTypes: INITIAL_INVENTORY_DATA,
        transactions: [],
        
        // Mutations
        updateVariantInventory: (typeId, shapeId, variantId, inStock, sold) => {...},
        addTransaction: (transaction) => {...},
        editTransaction: (id, updates) => {...},
        deleteTransaction: (id) => {...},
        
        // Selectors
        getProduct: (typeId, shapeId, variantId) => {...},
        getAllProducts: () => {...},
        getProductTransactions: (typeId, shapeId, variantId) => {...},
      }),
      { name: 'hamza-inventory-store' }
    )
  )
)
```

### Why Zustand?

1. **Minimal boilerplate**: No actions, reducers, or dispatches
2. **Performant**: Only components that use data re-render
3. **DevTools**: Full Redux DevTools support for debugging
4. **Middleware**: Built-in persistence middleware
5. **Small bundle**: ~2KB gzipped

---

## Data Flow

### Flow Diagram

```
User Action (click color, add/remove item)
    ↓
Component Event Handler
    ↓
Custom Hook (useAddProduct, useRemoveProduct)
    ↓
Zustand Store Action (updateVariantInventory)
    ↓
Store State Updated + Transaction Created
    ↓
localStorage Updated (automatic via persist middleware)
    ↓
Subscribed Components Re-render (CardContent)
    ↓
UI Shows Updated Data
```

### Example: Adding 5 items to stock

```javascript
// User fills form and clicks save
const handleAddProduct = () => {
  const addProduct = useAddProduct();
  addProduct('type1', 'shape-1', 'gold', 5);
};

// Inside hook:
// 1. Get current product from store
// 2. Update inStock: 39 + 5 = 44
// 3. Call store.updateVariantInventory()
// 4. Create transaction entry
// 5. Store auto-persists to localStorage
// 6. CardContent re-renders with new number
```

---

## CRUD Operations

### CREATE - Add Product (Stock In)

```javascript
import { useAddProduct } from '../hooks/useInventory';

const AddProduct = ({ allData, onSubmit }) => {
  const addProduct = useAddProduct();
  
  const handleSubmit = () => {
    const amount = 5; // from form input
    addProduct(
      allData.typeId,     // 'type1'
      allData.id,         // 'shape-1'
      variant.id,         // 'gold'
      amount              // 5
    );
    onSubmit();  // Close form
  };
  
  return <button onClick={handleSubmit}>إضافة</button>;
};
```

**What happens**:
1. `inStock` increases by 5
2. Transaction logged: `{ type: 'add', amount: 5, date: ... }`
3. Stored in localStorage automatically
4. All cards showing this product update

### READ - Get Product Data

```javascript
import { useCurtainTypes, useGetProduct } from '../hooks/useInventory';

// Get all types with shapes and variants
const InventoryPage = () => {
  const curtainTypes = useCurtainTypes();
  return curtainTypes.map(type => (...));
};

// Get specific product
const ProductDetail = () => {
  const getProduct = useGetProduct();
  const product = getProduct('type1', 'shape-1', 'gold');
  return <div>{product.inStock}</div>;
};
```

### UPDATE - Modify Inventory

```javascript
import { useUpdateVariantInventory } from '../hooks/useInventory';

const UpdateInventory = () => {
  const updateVariantInventory = useUpdateVariantInventory();
  
  // Manually set inStock and sold
  const handleUpdate = () => {
    updateVariantInventory('type1', 'shape-1', 'gold', 50, 20);
  };
  
  return <button onClick={handleUpdate}>تحديث</button>;
};
```

### DELETE - Remove Sale (Remove Product)

```javascript
import { useRemoveProduct } from '../hooks/useInventory';

const RemoveProduct = ({ allData, onSubmit }) => {
  const removeProduct = useRemoveProduct();
  
  const handleSubmit = () => {
    const amount = 3; // from form input
    removeProduct(
      allData.typeId,
      allData.id,
      variant.id,
      amount
    );
    onSubmit();
  };
  
  return <button onClick={handleSubmit}>بيع</button>;
};
```

**What happens**:
1. `inStock` decreases by 3
2. `sold` increases by 3
3. Transaction logged: `{ type: 'remove', amount: 3, date: ... }`
4. If inStock < amount, shows error

---

## Transaction System

### Transaction Structure

```javascript
{
  id: 'tx-1732105200123-abc123def',
  type: 'add' | 'remove',
  typeId: 'type1',
  shapeId: 'shape-1',
  variantId: 'gold',
  amount: 5,
  date: '2025-11-26T20:20:00.123Z',
  note: 'Added 5 units of ذهبي',
  updatedAt: '2025-11-26T20:21:00.123Z'  // Only if edited
}
```

### Transaction Operations

```javascript
import { useTransactions } from '../hooks/useInventory';

const TransactionManager = () => {
  const {
    addTransaction,
    editTransaction,
    deleteTransaction,
    getProductTransactions,
    getAllTransactions
  } = useTransactions();
  
  // Get all transactions for a product
  const txs = getProductTransactions('type1', 'shape-1', 'gold');
  
  // Edit a transaction
  editTransaction('tx-123', { note: 'Updated note' });
  
  // Delete a transaction (but DON'T auto-revert inventory)
  deleteTransaction('tx-123');
  
  // Get all transactions ever
  const allTxs = getAllTransactions();
};
```

**Important**: Deleting a transaction does NOT automatically revert inventory changes. You must manually update inventory if needed.

---

## Persistence & localStorage

### How Persistence Works

Zustand's `persist` middleware automatically:
1. Saves state to localStorage after every change
2. Restores state on app load
3. Uses versioning to handle migrations

### localStorage Key

```javascript
// Key: 'hamza-inventory-store'
// Value: JSON stringified state
{
  "curtainTypes": [...],
  "transactions": [...],
  "version": 1
}
```

### Clear localStorage (Reset to Fresh Data)

```javascript
// Browser console
localStorage.removeItem('hamza-inventory-store');
location.reload();

// Or use reset hook
import { useResetInventory } from '../hooks/useInventory';
const ResetButton = () => {
  const resetInventory = useResetInventory();
  return <button onClick={resetInventory}>إعادة تعيين</button>;
};
```

### Verify Data Persisted

```javascript
// Browser console
const stored = JSON.parse(localStorage.getItem('hamza-inventory-store'));
console.log(stored.state.curtainTypes);
```

---

## Component Integration

### InventoryPage - Data Source

```javascript
import { useCurtainTypes } from '../../hooks/useInventory.js';

const InventoryPage = () => {
  const curtainTypes = useCurtainTypes();  // Reads from store
  
  return (
    <div>
      {curtainTypes.map(type => (
        <div key={type.id}>
          <h2>{type.name}</h2>
          {type.shapes.map(shape => (
            <ProductCard key={shape.id} allData={{...shape, typeId: type.id, typeName: type.name}} />
          ))}
        </div>
      ))}
    </div>
  );
};
```

### ProductCard - Orchestrator

```javascript
const ProductCard = ({ allData }) => {
  const [flipped, setFlipped] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  
  const handleAction = (action) => {
    setActiveAction(action);
    setFlipped(true);
  };
  
  const handleFormSubmit = () => {
    setFlipped(false);    // Close form
    setActiveAction(null);
    // CardContent automatically re-renders due to store subscription
  };
  
  return (
    <div className={`cardWrapper ${flipped ? 'flipped' : ''}`}>
      <FrontFace handleAction={handleAction} allData={allData} />
      <BackFace 
        activeAction={activeAction} 
        allData={allData}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
```

### CardContent - Store Subscriber

```javascript
import useInventoryStore from '../../store/inventoryStore';

const CardContent = ({ allData, selectedVariantIndex = 0 }) => {
  // Subscribe to store changes for this specific product
  const variant = useInventoryStore(state => {
    const type = state.curtainTypes.find(t => t.id === allData?.typeId);
    const shape = type?.shapes.find(s => s.id === allData?.id);
    return shape?.variants?.[selectedVariantIndex];
  });
  
  // Re-renders automatically when variant.inStock or variant.sold changes
  return (
    <ul>
      <li>المخزون: {variant?.inStock}</li>
      <li>المباع: {variant?.sold}</li>
      <li>الاجمالي: {(variant?.inStock || 0) + (variant?.sold || 0)}</li>
    </ul>
  );
};
```

### AddProduct - Form Handler

```javascript
import { useAddProduct } from '../hooks/useInventory';

const AddProduct = forwardRef(({ allData, onSubmit }, ref) => {
  const [amount, setAmount] = useState('');
  const addProduct = useAddProduct();  // Hook from store
  
  const handleSubmit = () => {
    const variant = allData?.variants?.[0];
    addProduct(allData.typeId, allData.id, variant.id, parseInt(amount));
    setAmount('');
    onSubmit?.();  // Tell ProductCard to close form
  };
  
  useImperativeHandle(ref, () => ({ handleSubmit }));
  
  return <input value={amount} onChange={e => setAmount(e.target.value)} />;
});
```

---

## Usage Examples

### Example 1: Adding Stock to a Product

```javascript
// User goes to Inventory Page → Clicks Add button on a card → Fills form → Saves

// What happens internally:
1. AddProduct.handleSubmit() is called
2. useAddProduct() hook executes
3. Gets current product from store
4. Calls store.updateVariantInventory(type1, shape1, gold, 44, 10)
5. Creates transaction entry
6. localStorage auto-updates
7. CardContent subscribes and re-renders
8. Form closes

// Result: inStock: 39 + 5 = 44
```

### Example 2: Selling Items

```javascript
// User → Remove button → Fills quantity + buyer name → Saves

// What happens:
1. RemoveProduct.handleSubmit() is called
2. useRemoveProduct() hook executes
3. Validates inStock >= amount
4. Calls store.updateVariantInventory(type1, shape1, gold, 34, 15)
5. Creates transaction with buyer name
6. localStorage persists
7. All cards re-render

// Result: inStock: 39 - 5 = 34, sold: 10 + 5 = 15
```

### Example 3: Real-Time Sync on Page Refresh

```javascript
// User adds 5 items → Refresh page → Data still shows updated numbers

// Why:
1. Zustand persist middleware saves to localStorage
2. On page reload, middleware checks localStorage
3. Restores exact state including transactions
4. App initializes with fresh data automatically
5. No randomization occurs

// No more "data disappeared after refresh"!
```

### Example 4: Accessing All Products

```javascript
import { useGetAllProducts } from '../hooks/useInventory';

const SalesPage = () => {
  const getAllProducts = useGetAllProducts();
  const flatProducts = getAllProducts();
  
  // flatProducts = [
  //   { id: 'gold', name: 'ذهبي', inStock: 44, sold: 10, shapeId: 'shape1', typeId: 'type1', ... },
  //   { id: 'green', name: 'أخضر', inStock: 18, sold: 11, shapeId: 'shape1', typeId: 'type1', ... },
  //   ...
  // ]
  
  return flatProducts.map(p => <ProductRow key={`${p.typeId}-${p.shapeId}-${p.id}`} product={p} />);
};
```

### Example 5: Transaction History

```javascript
import { useAllTransactions } from '../hooks/useInventory';

const TransactionLog = () => {
  const transactions = useAllTransactions();
  
  return (
    <table>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{tx.type === 'add' ? '+ إضافة' : '- بيع'}</td>
            <td>{tx.amount}</td>
            <td>{new Date(tx.date).toLocaleString('ar')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## Debugging

### Using Redux DevTools

1. Install Redux DevTools browser extension
2. Zustand devtools middleware logs every action
3. Open DevTools → Redux tab → See all state changes with diff

### Console Logging

```javascript
// View current store state
import useInventoryStore from '../store/inventoryStore';
const state = useInventoryStore.getState();
console.log(state);

// Subscribe to all changes
useInventoryStore.subscribe(state => {
  console.log('Store updated:', state);
});
```

### Check localStorage

```javascript
// Browser console
JSON.parse(localStorage.getItem('hamza-inventory-store'))
```

---

## Migration & Scaling

### Adding New Product Types

Edit `INITIAL_INVENTORY_DATA` in `inventoryStore.js`:

```javascript
{
  id: 'type4',
  name: 'نوع جديد',
  description: 'وصف',
  shapes: [
    {
      id: 'shape-1',
      name: 'شكل 1',
      variants: [
        { id: 'color1', name: 'اللون', code: '#000', inStock: 50, sold: 0 },
      ]
    }
  ]
}
```

### Adding New Fields to Products

```javascript
// In INITIAL_INVENTORY_DATA variants:
{
  id: 'gold',
  name: 'ذهبي',
  code: '#FFD700',
  image: 'path',
  inStock: 39,
  sold: 10,
  
  // Add new fields here:
  price: 1500,
  category: 'premium',
  sku: 'SKU123'
}

// Then access in components:
const product = getProduct(...);
console.log(product.price);  // Works!
```

### Adding Features

1. Add new state to store: `newField: []`
2. Add actions: `setNewField: (data) => set(...)`
3. Export hook: `export const useNewField = () => useInventoryStore(state => state.newField)`
4. Use in components: `const data = useNewField()`

---

## Performance Optimization

### Zustand Selectors (Already Optimized)

```javascript
// ✅ Good: Only re-render when this specific value changes
const variant = useInventoryStore(state => state.curtainTypes[...].variants[...].inStock);

// ❌ Bad: Re-renders when ANY store state changes
const state = useInventoryStore();
```

### Memoization for Complex Components

```javascript
import { memo } from 'react';

const ProductCard = memo(({ allData }) => {
  // Won't re-render unless allData changes
  return ...;
});
```

---

## Summary

✅ **Single Source of Truth**: Zustand store  
✅ **No Randomization**: Fixed initial data  
✅ **Persistence**: localStorage automatic  
✅ **Real-Time Sync**: Store subscribers  
✅ **Transaction Log**: All changes tracked  
✅ **Clean Separation**: Hooks + Components  
✅ **CRUD Ready**: Add, Read, Update, Delete operations  
✅ **Scalable**: Easy to add features  

---

## Quick Checklist

- [x] Store created with Zustand
- [x] Initial data fixed (no random)
- [x] Hooks for CRUD
- [x] Components subscribed to store
- [x] localStorage persistence
- [x] Transaction logging
- [x] Forms update store
- [x] CardContent re-renders on data change
- [x] InventoryPage uses store
- [x] Data stable after refresh

Your inventory system is now **fully synchronized, persistent, and production-ready**! 🚀
