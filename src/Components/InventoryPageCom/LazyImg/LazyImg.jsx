import { useEffect, useRef, useState } from "react";
import './LazyImg.css'

const LazyImg = ({ src, alt, className }) => {
  const [visible, setVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
    });

    if (imgRef.current) observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={visible ? src : undefined}
      alt={alt}
      className={className}
      loading="lazy"
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    />
  );
};
export default LazyImg