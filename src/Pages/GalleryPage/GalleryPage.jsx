import { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import GalleryImgsData from '../../Data/GalleryImgsData';
import { LazyImg } from "../../Components";
import { DynamicNav, MainContainer } from "../../Layouts";
import { useDocumentTitle } from '../../Hooks';
import './GalleryPage.css';

const IMAGES_PER_LOAD = 20;

const GalleryPage = () => {
  useDocumentTitle('Gallery Page');
  const [shuffledImages, setShuffledImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const observerRef = useRef(null);

  // Shuffle images once on mount
  useEffect(() => {
    const shuffled = [...GalleryImgsData].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    setVisibleImages(shuffled.slice(0, IMAGES_PER_LOAD));
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!visibleImages.length) return;
    const lastImg = observerRef.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleImages(prev => {
          const nextBatch = shuffledImages.slice(prev.length, prev.length + IMAGES_PER_LOAD);
          return [...prev, ...nextBatch];
        });
      }
    }, { threshold: 1 });

    if (lastImg) observer.observe(lastImg);
    return () => { if (lastImg) observer.unobserve(lastImg); }
  }, [visibleImages, shuffledImages]);

  const breakpointColumnsObj = { default: 4, 1280: 3, 768: 2, 480: 1 };

  // Convert images to lightbox format
  const lightboxSlides = visibleImages.map(img => ({
    src: img.src,
    alt: `${img.id} ستارة`
  }));

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* <DynamicNav className={"galleryPageNav"} title={"معرض الأعمال"} /> */}
      <MainContainer>
        <div className="PAGE galleryPage">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {visibleImages.map((theImg, index) => {
              const isLast = index === visibleImages.length - 1;
              return (
                <div
                  className="imgWrapper fade-in"
                  key={theImg.id}
                  ref={isLast ? observerRef : null}
                  onClick={() => handleImageClick(index)}
                >
                  <LazyImg
                    src={theImg.src}
                    alt={`${theImg.id} ستارة`}
                    className="currentImg"
                  />
                </div>
              );
            })}
          </Masonry>

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={lightboxSlides}
            index={lightboxIndex}
            on={{
              view: ({ index }) => setLightboxIndex(index)
            }}
          />
        </div>
      </MainContainer>
    </>
  );
};

export default GalleryPage;
