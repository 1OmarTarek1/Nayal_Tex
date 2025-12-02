import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Initial data structure (fixed, no randomization)
const INITIAL_INVENTORY_DATA = [
  {
    id: 'type1',
    name: 'رومانية',
    description: 'ستائر كلاسيكية أنيقة تناسب جميع أنواع الغرف',
    shapes: [
      {
        id: 'shape-1',
        name: 'شكل 1',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 39, sold: 10 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 18, sold: 11 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 10, sold: 10 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 31, sold: 0 }
        ]
      },
      {
        id: 'shape-2',
        name: 'شكل 2',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 41, sold: 18 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 28, sold: 1 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 31, sold: 3 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 36, sold: 7 }
        ]
      },
      {
        id: 'shape-3',
        name: 'شكل 3',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 35, sold: 6 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 53, sold: 14 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 45, sold: 6 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 9, sold: 19 }
        ]
      },
      {
        id: 'shape-4',
        name: 'شكل 4',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 29, sold: 5 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 19, sold: 10 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 45, sold: 16 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 8, sold: 2 }
        ]
      },
      {
        id: 'shape-5',
        name: 'شكل 5',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 24, sold: 18 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 39, sold: 11 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 46, sold: 8 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 15, sold: 3 }
        ]
      },
      {
        id: 'shape-6',
        name: 'شكل 6',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 28, sold: 10 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 31, sold: 5 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 13, sold: 18 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 16, sold: 3 }
        ]
      },
      {
        id: 'shape-7',
        name: 'شكل 7',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 34, sold: 0 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 32, sold: 2 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 25, sold: 0 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 11, sold: 12 }
        ]
      },
      {
        id: 'shape-8',
        name: 'شكل 8',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 11, sold: 13 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 8, sold: 1 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 42, sold: 2 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 17, sold: 13 }
        ]
      },
      {
        id: 'shape-9',
        name: 'شكل 9',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 43, sold: 1 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 34, sold: 10 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 46, sold: 4 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 49, sold: 14 }
        ]
      },
      {
        id: 'shape-10',
        name: 'شكل 10',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 45, sold: 2 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 50, sold: 10 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 34, sold: 12 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 22, sold: 8 }
        ]
      }
    ]
  },
  {
    id: 'type2',
    name: 'بلاك اوت',
    description: 'ستائر عازلة للضوء والصوت',
    shapes: [
      {
        id: 'shape-11',
        name: 'شكل 1',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 25, sold: 5 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 30, sold: 8 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 22, sold: 12 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 40, sold: 6 }
        ]
      },
      {
        id: 'shape-12',
        name: 'شكل 2',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 35, sold: 10 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 28, sold: 4 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 19, sold: 8 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 42, sold: 11 }
        ]
      },
      {
        id: 'shape-13',
        name: 'شكل 3',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 20, sold: 7 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 15, sold: 3 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 38, sold: 9 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 27, sold: 5 }
        ]
      },
      {
        id: 'shape-14',
        name: 'شكل 4',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 32, sold: 6 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 44, sold: 12 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 26, sold: 7 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 19, sold: 4 }
        ]
      },
      {
        id: 'shape-15',
        name: 'شكل 5',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 37, sold: 8 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 21, sold: 5 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 29, sold: 11 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 33, sold: 9 }
        ]
      },
      {
        id: 'shape-16',
        name: 'شكل 6',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 24, sold: 4 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 36, sold: 9 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 17, sold: 6 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 41, sold: 10 }
        ]
      },
      {
        id: 'shape-17',
        name: 'شكل 7',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 30, sold: 2 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 26, sold: 7 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 39, sold: 3 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 23, sold: 8 }
        ]
      },
      {
        id: 'shape-18',
        name: 'شكل 8',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 28, sold: 9 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 34, sold: 6 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 20, sold: 10 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 38, sold: 5 }
        ]
      },
      {
        id: 'shape-19',
        name: 'شكل 9',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 31, sold: 4 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 25, sold: 11 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 43, sold: 7 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 18, sold: 2 }
        ]
      },
      {
        id: 'shape-20',
        name: 'شكل 10',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 40, sold: 8 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 33, sold: 5 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 27, sold: 9 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 36, sold: 6 }
        ]
      }
    ]
  },
  {
    id: 'type3',
    name: 'شيفون',
    description: 'ستائر خفيفة تسمح بمرور الضوء',
    shapes: [
      {
        id: 'shape-21',
        name: 'شكل 1',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 48, sold: 3 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 22, sold: 9 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 35, sold: 5 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 14, sold: 7 }
        ]
      },
      {
        id: 'shape-22',
        name: 'شكل 2',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 26, sold: 6 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 41, sold: 10 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 19, sold: 4 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 32, sold: 8 }
        ]
      },
      {
        id: 'shape-23',
        name: 'شكل 3',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 38, sold: 7 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 29, sold: 2 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 44, sold: 11 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 21, sold: 9 }
        ]
      },
      {
        id: 'shape-24',
        name: 'شكل 4',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 23, sold: 5 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 37, sold: 8 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 30, sold: 6 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 16, sold: 3 }
        ]
      },
      {
        id: 'shape-25',
        name: 'شكل 5',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 45, sold: 9 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 24, sold: 4 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 31, sold: 8 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 28, sold: 10 }
        ]
      },
      {
        id: 'shape-26',
        name: 'شكل 6',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 19, sold: 3 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 42, sold: 7 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 25, sold: 9 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 39, sold: 5 }
        ]
      },
      {
        id: 'shape-27',
        name: 'شكل 7',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 36, sold: 6 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 27, sold: 11 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 40, sold: 4 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 20, sold: 8 }
        ]
      },
      {
        id: 'shape-28',
        name: 'شكل 8',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 32, sold: 10 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 18, sold: 2 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 47, sold: 5 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 25, sold: 7 }
        ]
      },
      {
        id: 'shape-29',
        name: 'شكل 9',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 34, sold: 8 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 39, sold: 5 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 22, sold: 9 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 44, sold: 6 }
        ]
      },
      {
        id: 'shape-30',
        name: 'شكل 10',
        variants: [
          { id: 'gold', name: 'ذهبي', code: '#FFD700', image: '/Hamza/src/assets/Images/Gallery/01.webp', inStock: 29, sold: 4 },
          { id: 'green', name: 'أخضر', code: '#32CD32', image: '/Hamza/src/assets/Images/Gallery/02.webp', inStock: 46, sold: 9 },
          { id: 'white', name: 'أبيض', code: '#FFFFFF', image: '/Hamza/src/assets/Images/Gallery/03.webp', inStock: 18, sold: 6 },
          { id: 'black', name: 'أسود', code: '#000000', image: '/Hamza/src/assets/Images/Gallery/04.webp', inStock: 37, sold: 11 }
        ]
      }
    ]
  }
];

// Zustand store with persistence
const useInventoryStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        curtainTypes: INITIAL_INVENTORY_DATA,
        transactions: [],

        // Get all products in flat format (for sales page, etc.)
        getAllProducts: () => {
          const { curtainTypes } = get();
          return curtainTypes.flatMap(type =>
            type.shapes.flatMap(shape =>
              shape.variants.map(variant => ({
                ...variant,
                shapeId: shape.id,
                shapeName: shape.name,
                typeId: type.id,
                typeName: type.name
              }))
            )
          );
        },

        // Get specific product by IDs
        getProduct: (typeId, shapeId, variantId) => {
          const { curtainTypes } = get();
          const type = curtainTypes.find(t => t.id === typeId);
          if (!type) return null;
          const shape = type.shapes.find(s => s.id === shapeId);
          if (!shape) return null;
          return shape.variants.find(v => v.id === variantId) || null;
        },

        // Update variant inventory (inStock and sold)
        updateVariantInventory: (typeId, shapeId, variantId, inStock, sold) => {
          set(state => {
            const newTypes = JSON.parse(JSON.stringify(state.curtainTypes));
            const type = newTypes.find(t => t.id === typeId);
            if (!type) return state;
            const shape = type.shapes.find(s => s.id === shapeId);
            if (!shape) return state;
            const variant = shape.variants.find(v => v.id === variantId);
            if (variant) {
              variant.inStock = Math.max(0, inStock);
              variant.sold = Math.max(0, sold);
            }
            return { curtainTypes: newTypes };
          });
        },

        // Create a transaction
        addTransaction: (transaction) => {
          const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newTx = {
            ...transaction,
            id,
            date: transaction.date || new Date().toISOString()
          };
          set(state => ({
            transactions: [...state.transactions, newTx]
          }));
          return newTx;
        },

        // Edit a transaction
        editTransaction: (transactionId, updates) => {
          set(state => ({
            transactions: state.transactions.map(tx =>
              tx.id === transactionId ? { ...tx, ...updates, updatedAt: new Date().toISOString() } : tx
            )
          }));
        },

        // Delete a transaction
        deleteTransaction: (transactionId) => {
          set(state => ({
            transactions: state.transactions.filter(tx => tx.id !== transactionId)
          }));
        },

        // Get all transactions for a specific product
        getProductTransactions: (typeId, shapeId, variantId) => {
          const { transactions } = get();
          return transactions.filter(
            tx => tx.typeId === typeId && tx.shapeId === shapeId && tx.variantId === variantId
          );
        },

        // Reset to initial data (for debugging)
        resetInventory: () => {
          set({
            curtainTypes: JSON.parse(JSON.stringify(INITIAL_INVENTORY_DATA)),
            transactions: []
          });
        }
      }),
      {
        name: 'hamza-inventory-store',
        version: 1
      }
    )
  )
);

export default useInventoryStore;
