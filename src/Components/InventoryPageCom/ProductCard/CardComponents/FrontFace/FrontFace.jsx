import { useState } from 'react'
import CardContent from './FF_components/CardContent/CardContent'
import InventoryActions from './FF_components/InventoryActions/InventoryActions'
import SCBG from './FF_components/SCBG/SCBG'
import testImage from '../../../../../assets/Images/Gallery/01.webp'
import './FrontFace.css'

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const FrontFace = ({ handleAction, allData, selectedVariantIndex = 0, onSelectVariant, activeFilterColor, isManuallySelected }) => {

    const [openLightbox, setOpenLightbox] = useState(false);

    // use selected variant index passed from parent, no local reset
    const imageSrc = allData?.variants?.[selectedVariantIndex]?.image || testImage;
    const selectedVariant = allData?.variants?.[selectedVariantIndex] || null;

    const handleSelectVariant = (index) => {
        onSelectVariant?.(index);
    };

    return (
        <>
            <div className="imageContent">
                <div
                    className="cardImgWrapper"
                    onClick={() => setOpenLightbox(true)}
                    style={{ cursor: 'pointer' }}
                    title="اضغط لتكبير الصورة"
                >
                    <img src={imageSrc} alt={allData?.name || ''} />
                </div>

                <Lightbox
                    open={openLightbox}
                    close={() => setOpenLightbox(false)}
                    slides={allData?.variants?.map(v => ({ src: v.image, alt: v.name })) || [{ src: imageSrc }]}
                    index={selectedVariantIndex}
                    carousel={{ finite: true }}
                    on={{
                        view: ({ index }) => onSelectVariant?.(index)
                    }}
                />
                <SCBG
                    variants={allData?.variants || []}
                    selectedIndex={selectedVariantIndex}
                    onSelect={handleSelectVariant}
                    activeFilterColor={activeFilterColor}
                    isManuallySelected={isManuallySelected}
                />
                <InventoryActions
                    handleAction={handleAction}
                />
                <div className="colorTitle">
                    <span
                        className="colorSwatch"
                        style={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            marginInlineEnd: 5,
                            verticalAlign: 'middle',
                            backgroundColor: selectedVariant?.code || 'transparent',
                            border: selectedVariant?.code ? '1px solid rgba(0,0,0,0.12)' : '1px solid transparent',
                            borderRadius: 2
                        }}
                    />
                    <span>{selectedVariant?.name || selectedVariant?.id || '-'}</span>
                </div>
                <div className="shapeTitle">{allData.name}</div>
                <div className="cardTitle">{allData.typeName}</div>
            </div>
            <CardContent allData={allData} selectedVariantIndex={selectedVariantIndex} />
        </>
    )
}

export default FrontFace