import { useState, useRef } from 'react'
import { DynamicNav, MainContainer } from '../../Layouts'
import { ProductCard, FilterSearch, SectionHeader } from '../../Components'
import { useCurtainTypes } from '../../Hooks/useInventory.js';
import useInventoryStore from '../../store/inventoryStore'; // Import store hook
import { runSalesSimulation, runStockAddition } from '../../utils/seederUtils'; // Import simulation utilities
import './InventoryPage.css';

const InventoryPage = () => {
  // Get data from centralized store
  const curtainTypes = useCurtainTypes();
  const { getAllProducts, updateVariantInventory, addTransaction } = useInventoryStore(); // Get actions
  const [filteredTypes, setFilteredTypes] = useState(curtainTypes);
  const [activeFilterColor, setActiveFilterColor] = useState('all');
  const scrollRefs = useRef({});

  // Helper to run sales simulation
  const handleSimulation = () => {
    if (window.confirm('هل أنت متأكد أنك تريد إضافة 50 عملية بيع عشوائية؟')) {
      runSalesSimulation(getAllProducts, updateVariantInventory, addTransaction);
    }
  };

  // Helper to run bulk stock addition
  const handleStockAddition = () => {
    if (window.confirm('هل أنت متأكد أنك تريد إضافة 50 وحدة لجميع المنتجات؟')) {
      runStockAddition(getAllProducts, updateVariantInventory, addTransaction);
    }
  };

  // render each type with its title and cards
  const CardsByType = filteredTypes.map((type) => (
    <div key={type.id} className="typeSection">
      {/* Products Container */}
      <div
        className="ProductsContainer"
        ref={(el) => scrollRefs.current[type.id] = el}
      >
        {type.shapes.map((shape) => (
          <ProductCard
            key={`${type.id}-${shape.id}`}
            allData={{ ...shape, typeId: type.id, typeName: type.name }}
            activeFilterColor={activeFilterColor}
          />
        ))}
      </div>

      {/* Section Header with Title and Scroll Buttons - Below Container */}
      <SectionHeader
        title={type.name}
        scrollRef={{ current: scrollRefs.current[type.id] }}
      />
    </div>
  ));

  return (
    <>
      {/* <DynamicNav className={"inventoryPageNav"} /> */}
      <MainContainer>
        <div className="PAGE inventoryPage ">
          <FilterSearch
            curtainTypes={curtainTypes}
            onFilter={setFilteredTypes}
            onColorChange={setActiveFilterColor}
          />
          {CardsByType}

          {/* Developer Tool: Manual Simulation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '50px', opacity: 0.5 }}>
            <button
              onClick={handleSimulation}
              style={{
                background: 'var(--DT-nestedComponent)',
                color: 'var(--DT-text)',
                padding: '10px 20px',
                border: '1px solid var(--DT-borderLight)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              🛠️ محاكاة بيع (50 عملية)
            </button>

            <button
              onClick={handleStockAddition}
              style={{
                background: 'var(--DT-nestedComponent)',
                color: 'var(--DT-text)',
                padding: '10px 20px',
                border: '1px solid var(--primary2-color)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              📦 إضافة 50 وحدة للكل
            </button>

            <button
              onClick={() => {
                if (window.confirm('⚠️ تحذير خطير!\n\nهل أنت متأكد من تصفير جميع البيانات؟\n- سيتم حذف كل المخزون.\n- سيتم حذف كل المبيعات.\n- سيتم حذف سجل المعاملات بالكامل.\n\nلا يمكن التراجع عن هذه الخطوة!')) {
                  // 1. Reset Zustand Store
                  useInventoryStore.getState().resetInventory();

                  // 2. Clear known legacy keys if they exist
                  localStorage.removeItem('inventory_seeded');
                  localStorage.removeItem('sales_seeded');
                  localStorage.removeItem('sales_seeded_v2');

                  alert('تم تصفير النظام بنجاح! 🗑️\n(تم مسح جميع البيانات والبدء من الصفر)');
                }
              }}
              style={{
                background: 'rgba(244, 67, 54, 0.15)',
                color: '#f44336',
                padding: '10px 20px',
                border: '1px solid #f44336',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ⚠️ تصفير الكل
            </button>
          </div>

        </div>
      </MainContainer>
    </>
  );
};

export default InventoryPage;
