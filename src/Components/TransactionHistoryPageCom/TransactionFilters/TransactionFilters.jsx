import React from 'react';
import './TransactionFilters.css';

const TransactionFilters = ({
    filterType,
    setFilterType,
    curtainType,
    setCurtainType,
    colorFilter,
    setColorFilter,
    searchTerm,
    setSearchTerm,
    dateSort,
    setDateSort,
    quantitySort,
    setQuantitySort,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    curtainTypes,
    uniqueColors,
    onClearFilters,
    onDeleteAll
}) => {
    return (
        <div className="filterSection">
            <div className="filterGroup">
                <select
                    id="typeFilter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filterSelect"
                >
                    <option id='allId' value="all">كل العمليات</option>
                    <option id='addId' value="add">إضافة منتجات</option>
                    <option id='remvId' value="remove">بيع منتجات</option>
                </select>
            </div>

            <div className="filterGroup">
                <select
                    id="curtainTypeFilter"
                    value={curtainType}
                    onChange={(e) => setCurtainType(e.target.value)}
                    className="filterSelect"
                >
                    <option id="valAllId" value="all">كل الأنواع</option>
                    {curtainTypes.map(type => (
                        <option id={type.id} key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filterGroup">
                <select
                    id="colorFilter"
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    className="filterSelect"
                >
                    <option id="valAllColorsId" value="all">كل الألوان</option>
                    {uniqueColors.map((color, index) => (
                        <option id={index} key={index} value={color}>
                            {color}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filterGroup searchGroup">
                <input
                    id="search"
                    type="text"
                    placeholder="ابحث عن منتج أو نوع أو لون..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchInput"
                />
            </div>

            <div className="filterGroup">
                <select id="dateSortId"
                    value={dateSort}
                    onChange={(e) => setDateSort(e.target.value)}
                    className="sortSelect"
                >
                    <option id="valNewestFirstId" value="desc">الأحدث أولاً ✓</option>
                    <option id="valOldestFirstId" value="asc">الأقدم أولاً</option>
                </select>
            </div>

            <div className="filterGroup">
                <select id="quantitySortId"
                    value={quantitySort}
                    onChange={(e) => setQuantitySort(e.target.value)}
                    className="sortSelect"
                >
                    <option id="valNoSortId" value="none">بدون ترتيب</option>
                    <option id="valLargestFirstId" value="desc">الأكبر أولاً</option>
                    <option id="valSmallestFirstId" value="asc">الأصغر أولاً</option>
                </select>
            </div>

            <div className="filterGroup">
                <input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="dateInput"
                />
            </div>

            <div className="filterGroup">
                <input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="dateInput"
                    min={dateFrom}
                />
            </div>
            <div className="filterGroup">
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="actionBtn" onClick={onClearFilters} style={{ backgroundColor: 'var(--DT-nestedComponent)', border: '1px solid var(--DT-borderLight)' }}>مسح الفلاتر</button>
                    <button className="actionBtn danger" onClick={onDeleteAll}>حذف الكل</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;
