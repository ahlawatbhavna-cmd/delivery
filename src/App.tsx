import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese cubes marinated in spices and yogurt.',
    price: 12.99,
    category: 'Starters',
    image: 'https://picsum.photos/seed/paneer/400/300'
  },
  {
    id: '2',
    name: 'Crispy Corn',
    description: 'Golden fried sweet corn kernels tossed with peppers and onions.',
    price: 8.99,
    category: 'Starters',
    image: 'https://picsum.photos/seed/corn/400/300'
  },
  {
    id: '3',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils with cream and butter.',
    price: 14.99,
    category: 'Main Course',
    image: 'https://picsum.photos/seed/dal/400/300'
  },
  {
    id: '4',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice cooked with seasonal vegetables and aromatic spices.',
    price: 16.99,
    category: 'Main Course',
    image: 'https://picsum.photos/seed/biryani/400/300'
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    description: 'Soft milk-based dumplings soaked in cardamom-flavored sugar syrup.',
    price: 6.99,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/gulab/400/300'
  },
  {
    id: '6',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with sweet mango pulp.',
    price: 4.99,
    category: 'Beverages',
    image: 'https://picsum.photos/seed/lassi/400/300'
  },
  {
    id: '7',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in a thick paste made from pureed spinach.',
    price: 15.49,
    category: 'Main Course',
    image: 'https://picsum.photos/seed/palak/400/300'
  },
  {
    id: '8',
    name: 'Stuffed Mushroom',
    description: 'Mushrooms stuffed with cheese and herbs, breaded and fried.',
    price: 10.99,
    category: 'Starters',
    image: 'https://picsum.photos/seed/mushroom/400/300'
  }
];

export const DELIVERY_TIME_LIMIT = 30 * 60; // 30 minutes in seconds
export const PENALTY_ITEM = {
  name: 'Free Chocolate Brownie',
  description: 'Complimentary dessert for late delivery!',
  price: 0
};
