import img01 from '../assets//Images/Gallery/01.webp';
import img02 from '../assets//Images/Gallery/02.webp';
import img03 from '../assets//Images/Gallery/03.webp';
import img04 from '../assets//Images/Gallery/04.webp';


// Color variants with inventory data
const colorVariants = [
  {
    id: 'gold',
    name: 'ذهبي',
    code: '#FFD700',
    image: img01,
    inStock: 15,
    sold: 5
  },
  {
    id: 'green',
    name: 'أخضر',
    code: '#32CD32',
    image: img02,
    inStock: 20,
    sold: 10
  },
  {
    id: 'white',
    name: 'أبيض',
    code: '#FFFFFF',
    image: img03,
    inStock: 25,
    sold: 15
  },
  {
    id: 'black',
    name: 'أسود',
    code: '#000000',
    image: img04,
    inStock: 10,
    sold: 8
  }
];

// Generate shapes with color variants
const generateShapes = (count, startId = 1) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `shape-${startId + i}`,
    name: `شكل ${startId + i}`,
    variants: colorVariants.map(variant => ({
      ...variant,
      inStock: Math.floor(Math.random() * 50) + 5,
      sold: Math.floor(Math.random() * 20)
    }))
  }));
};

// Curtain types with their shapes
const curtainTypes = [
  {
    id: 'type1',
    name: 'رومانية',
    description: 'ستائر كلاسيكية أنيقة تناسب جميع أنواع الغرف',
    shapes: generateShapes(10, 1)
  },
  {
    id: 'type2',
    name: 'بلاك اوت',
    description: 'ستائر عازلة للضوء والصوت',
    shapes: generateShapes(10, 11)
  },
  {
    id: 'type3',
    name: 'شيفون',
    description: 'ستائر خفيفة تسمح بمرور الضوء',
    shapes: generateShapes(10, 21)
  }
];

export default curtainTypes;
