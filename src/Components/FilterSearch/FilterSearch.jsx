import { useState, useMemo, useEffect } from 'react'
import { MdFilterListOff } from 'react-icons/md'
import './FilterSearch.css'

const FilterSearch = ({ curtainTypes, onFilter, onColorChange }) => {
    const [searchText, setSearchText] = useState('')
    const [selectedType, setSelectedType] = useState('all')
    const [selectedColor, setSelectedColor] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    // Get unique colors from all variants with their hex codes
    const allColors = useMemo(() => {
        const colorMap = new Map()
        curtainTypes.forEach(type => {
            type.shapes.forEach(shape => {
                shape.variants.forEach(variant => {
                    if (!colorMap.has(variant.id)) {
                        colorMap.set(variant.id, {
                            id: variant.id,
                            name: variant.name,
                            code: variant.code
                        })
                    }
                })
            })
        })
        return Array.from(colorMap.values())
    }, [curtainTypes])

    // Filter logic
    const filteredData = useMemo(() => {
        let filtered = curtainTypes.map(type => ({
            ...type,
            shapes: type.shapes.filter(shape => {
                const matchesSearch =
                    searchText === '' ||
                    shape.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    type.name.toLowerCase().includes(searchText.toLowerCase())

                const matchesType = selectedType === 'all' || type.id === selectedType

                const matchesColor = selectedColor === 'all' ||
                    shape.variants.some(v => v.id === selectedColor)

                return matchesSearch && matchesType && matchesColor
            })
        })).filter(type => type.shapes.length > 0)

        return filtered
    }, [curtainTypes, searchText, selectedType, selectedColor])

    useEffect(() => {
        onFilter?.(filteredData)
    }, [filteredData, onFilter])

    // Notify parent about currently selected color for cross-component highlighting
    useEffect(() => {
        onColorChange?.(selectedColor)
    }, [selectedColor, onColorChange])

    const totalResults = filteredData.reduce((sum, type) => sum + type.shapes.length, 0)

    return (
        <div className="filterSearchContainer">
            <div className="filterHeader">
                <div className="searchBox">
                    <input
                        type="text"
                        placeholder="ابحث عن شكل أو نوع..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="searchInput"
                    />
                    <span className="searchIcon">🔍</span>
                </div>
                <div className="filterGroup">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="filterSelect"
                    >
                        <option value="all">جميع الأنواع</option>
                        {curtainTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="colorFilter">
                    {allColors.map(color => (
                        <button
                            key={color.id}
                            className={`colorOptionBtn ${selectedColor === color.id ? 'active' : ''}`}
                            onClick={() => setSelectedColor(color.id)}
                            title={color.name}
                            style={{
                                backgroundColor: color.code,
                                color: color.code === '#FFFFFF' || color.code === '#FFD700' ? '#000' : '#fff'
                            }}
                            data-color-id={color.id}
                        >
                            {/* {color.name} */}
                        </button>
                    ))}
                </div>
                <div className="filterResults">
                    <strong>{totalResults}</strong>
                </div>
                <button
                    className="clearFiltersBtn"
                    onClick={() => {
                        setSearchText('')
                        setSelectedType('all')
                        setSelectedColor('all')
                    }}
                >
                    <MdFilterListOff />
                </button>
            </div>


            {totalResults === 0 && searchText !== '' && (
                <div className="noResults">
                    لم يتم العثور على منتجات تطابق البحث
                </div>
            )}
        </div>
    )
}

export default FilterSearch
