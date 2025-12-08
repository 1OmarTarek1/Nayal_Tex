import img01 from '../assets//Images/Gallery/01.webp';
import img02 from '../assets//Images/Gallery/02.webp';
import img03 from '../assets//Images/Gallery/03.webp';
import img04 from '../assets//Images/Gallery/04.webp';

// ألوان التطريز والبلاك اوت (4 ألوان)
const embroideryColors = [
  {
    id: 'coffee',
    name: 'كافيه',
    code: '#6F4E37',
    image: img01,
    inStock: 0,
    sold: 0
  },
  {
    id: 'silver',
    name: 'فضي',
    code: '#C0C0C0',
    image: img02,
    inStock: 0,
    sold: 0
  },
  {
    id: 'gold',
    name: 'ذهبي',
    code: '#FFD700',
    image: img03,
    inStock: 0,
    sold: 0
  },
  {
    id: 'off-white',
    name: 'اوف وايت',
    code: '#F5F5DC',
    image: img04,
    inStock: 0,
    sold: 0
  }
];

// لون راشيل (لون واحد فقط)
const rachelColor = [
  {
    id: 'off-white',
    name: 'اوف وايت',
    code: '#F5F5DC',
    image: img01,
    inStock: 0,
    sold: 0
  }
];

// ===== النوع الأول: تطريز =====
const embroideryShapes = [
  'بونسيانا',
  'سكوير',
  'بامبو',
  'ريشه',
  'جومانجي',
  'كريستال',
  'هاشتاغ'
].map((shapeName, index) => ({
  id: `embroidery-shape-${index + 1}`,
  name: shapeName,
  variants: embroideryColors.map(color => ({
    ...color,
    inStock: 0,
    sold: 0
  }))
}));

// ===== النوع الثاني: راشيل =====
const rachelShapes = [
  'موسكو',
  'بوخارست',
  'سافانا',
  'ميلانو',
  'كوبرا',
  'نفرتيتي',
  'كلاود',
  'راندوم',
  'موناكو',
  'ميراج',
  'مون',
  'فرزتشي'
].map((shapeName, index) => ({
  id: `rachel-shape-${index + 1}`,
  name: shapeName,
  variants: rachelColor.map(color => ({
    ...color,
    inStock: 0,
    sold: 0
  }))
}));

// ===== النوع الثالث: بلاك اوت =====
const blackoutShapes = [
  'اسباني',
  'الماني'
].map((shapeName, index) => ({
  id: `blackout-shape-${index + 1}`,
  name: shapeName,
  variants: embroideryColors.map(color => ({
    ...color,
    inStock: 0,
    sold: 0
  }))
}));

// الأنواع الثلاثة الرئيسية
const curtainTypes = [
  {
    id: 'type1',
    name: 'تطريز',
    description: 'ستائر تطريز فاخرة بأشكال متنوعة وألوان راقية',
    shapes: embroideryShapes
  },
  {
    id: 'type2',
    name: 'راشيل',
    description: 'ستائر راشيل عصرية بتشكيلة واسعة من الأشكال',
    shapes: rachelShapes
  },
  {
    id: 'type3',
    name: 'بلاك اوت',
    description: 'ستائر بلاك اوت عازلة للضوء بجودة عالية',
    shapes: blackoutShapes
  }
];

export default curtainTypes;
