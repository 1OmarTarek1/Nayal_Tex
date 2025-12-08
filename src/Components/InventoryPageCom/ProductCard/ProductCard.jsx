import React, { useState, useEffect } from 'react'
import FrontFace from './CardComponents/FrontFace/FrontFace'
import BackFace from './CardComponents/BackFace/BackFace'
import './ProductCard.css'

const ProductCard = ({ allData, activeFilterColor }) => {
  const [flipped, setFlipped] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  const handleAction = (action) => {
    setActiveAction(action);
    setFlipped(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFlipped(false);
  };

  const handleFormSubmit = () => {
    // Flip back after submission (delay is handled by forms)
    setFlipped(false);
    setActiveAction(null);
  };

  // When user manually selects a color on the card, mark it as manually selected
  const handleSelectVariant = (index) => {
    setSelectedVariantIndex(index);
    setIsManuallySelected(true);
  };

  // When a global color filter is applied, switch the selected variant ONLY if user hasn't manually selected
  useEffect(() => {
    if (isManuallySelected) return; // User manually selected a color, don't override
    if (!activeFilterColor || activeFilterColor === 'all') return;
    const idx = allData?.variants?.findIndex(v => v.id === activeFilterColor);
    if (typeof idx === 'number' && idx >= 0) {
      setSelectedVariantIndex(idx);
    }
  }, [activeFilterColor, allData, isManuallySelected]);

  // Reset manual selection flag when filter changes (new filter allows user to click again)
  useEffect(() => {
    setIsManuallySelected(false);
  }, [activeFilterColor]);

  return (
    <div className={`cardWrapper ${flipped ? 'flipped' : ''}`}>
      <div className="flip-face productView frontFace">
        <FrontFace
          handleAction={handleAction}
          allData={allData}
          selectedVariantIndex={selectedVariantIndex}
          onSelectVariant={handleSelectVariant}
          activeFilterColor={activeFilterColor}
          isManuallySelected={isManuallySelected}
        />
      </div>
      <div className="flip-face productForm backFace">
        <BackFace
          activeAction={activeAction}
          handleCancel={handleCancel}
          allData={allData}
          onSubmit={handleFormSubmit}
          selectedVariantIndex={selectedVariantIndex}
        />
      </div>
    </div>
  )
}

// Custom comparison function for memoization
const arePropsEqual = (prevProps, nextProps) => {
  // 1. Check if active filter changed
  if (prevProps.activeFilterColor !== nextProps.activeFilterColor) {
    return false;
  }

  // 2. Check if static identifiers changed (unlikely within same list position but safe to check)
  if (prevProps.allData.id !== nextProps.allData.id) {
    return false;
  }

  // 3. Deep compare only the relevant mutable fields in variants (inStock, sold)
  // This avoids re-rendering when the store creates new object references but data is same
  const prevVars = prevProps.allData.variants || [];
  const nextVars = nextProps.allData.variants || [];

  if (prevVars.length !== nextVars.length) return false;

  for (let i = 0; i < prevVars.length; i++) {
    if (
      prevVars[i].inStock !== nextVars[i].inStock ||
      prevVars[i].sold !== nextVars[i].sold ||
      prevVars[i].code !== nextVars[i].code // in case code color changes (rare)
    ) {
      return false;
    }
  }

  return true;
};

export default React.memo(ProductCard, arePropsEqual);