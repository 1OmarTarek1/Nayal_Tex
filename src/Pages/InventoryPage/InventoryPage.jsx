import { useState } from 'react'
import { DynamicNav, MainContainer } from '../../Layouts'
import { ProductCard, FilterSearch } from '../../Components'
import { useCurtainTypes } from '../../hooks/useInventory.js';
import './InventoryPage.css';

const InventoryPage = () => {
  // Get data from centralized store
  const curtainTypes = useCurtainTypes();
  const [filteredTypes, setFilteredTypes] = useState(curtainTypes);
  const [activeFilterColor, setActiveFilterColor] = useState('all');

  // render each type with its title and cards
  const CardsByType = filteredTypes.map((type) => (
    <div key={type.id} className="typeSection">
      <div className="ProductsContainer">
        <div className="typeTitle">{type.name}</div>
        {type.shapes.map((shape) => (
          <ProductCard
            key={`${type.id}-${shape.id}`}
            allData={{ ...shape, typeId: type.id, typeName: type.name }}
            activeFilterColor={activeFilterColor}
          />
        ))}
      </div>
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
        </div>
      </MainContainer>
    </>
  );
};

export default InventoryPage;


