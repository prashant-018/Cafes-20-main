// Complete Restaurant Menu Data
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: {
    medium?: number;
    large?: number;
    regular?: number;
  };
  image: string;
  isVeg: boolean;
  category: string;
  isPopular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "classic-pizzas",
    name: "Classic Pizzas",
    description: "Traditional favorites with authentic flavors",
    icon: "🍕",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        description: "Classic tomato sauce, mozzarella cheese, and fresh basil",
        price: { medium: 299, large: 449 },
        image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
        isVeg: true,
        category: "Classic Pizzas",
        isPopular: true
      },
      {
        id: "cheese-n-corn",
        name: "Cheese n Corn",
        description: "Sweet corn kernels with creamy cheese blend",
        price: { medium: 349, large: 499 },
        image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "onion-pizza",
        name: "Onion Pizza",
        description: "Caramelized onions with cheese and herbs",
        price: { medium: 299, large: 449 },
        image: "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "capsicum-pizza",
        name: "Capsicum Pizza",
        description: "Fresh bell peppers with mozzarella cheese",
        price: { medium: 329, large: 479 },
        image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "cheese-n-tomato",
        name: "Cheese n Tomato",
        description: "Fresh tomatoes with premium cheese blend",
        price: { medium: 329, large: 479 },
        image: "https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "double-cheese",
        name: "Double Cheese",
        description: "Extra cheese for cheese lovers",
        price: { medium: 399, large: 549 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "veg-loaded",
        name: "Veg Loaded",
        description: "Loaded with fresh vegetables and cheese",
        price: { medium: 399, large: 549 },
        image: "https://i.pinimg.com/736x/b0/96/23/b09623357dd96f64242e391b00fae7fe.jpg",
        isVeg: true,
        category: "Classic Pizzas"
      },
      {
        id: "jain-special",
        name: "Jain Special",
        description: "Special pizza without onion and garlic",
        price: { medium: 379, large: 529 },
        image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
        isVeg: true,
        category: "Classic Pizzas"
      }
    ]
  },
  {
    id: "delight-pizzas",
    name: "Delight Pizzas",
    description: "Signature creations with unique flavors",
    icon: "🍕",
    items: [
      {
        id: "himalayan-special",
        name: "Himalayan Pizza Special",
        description: "Our signature pizza with exotic Himalayan flavors and premium toppings",
        price: { medium: 449, large: 599 },
        image: "https://images.pexels.com/photos/2762938/pexels-photo-2762938.jpeg",
        isVeg: true,
        category: "Delight Pizzas",
        isPopular: true
      },
      {
        id: "cheese-n-corn-delight",
        name: "Cheese n Corn Delight",
        description: "Premium corn with extra cheese and special seasoning",
        price: { medium: 399, large: 549 },
        image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg",
        isVeg: true,
        category: "Delight Pizzas"
      },
      {
        id: "achari-paneer",
        name: "Achari Paneer Pizza",
        description: "Tangy pickled paneer with Indian spices",
        price: { medium: 449, large: 599 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Delight Pizzas"
      }
    ]
  },
  {
    id: "premium-pizzas",
    name: "Premium / Special Pizzas",
    description: "Gourmet pizzas with premium ingredients",
    icon: "🍕",
    items: [
      {
        id: "seven-special",
        name: "Seven Special",
        description: "Seven premium toppings for the ultimate pizza experience",
        price: { medium: 499, large: 649 },
        image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
        isVeg: true,
        category: "Premium Pizzas",
        isPopular: true
      },
      {
        id: "veg-supreme",
        name: "Veg Supreme Pizza",
        description: "Loaded with fresh vegetables, olives, and premium cheese blend",
        price: { medium: 449, large: 599 },
        image: "https://i.pinimg.com/736x/2e/23/6f/2e236f086bbd1c433b0c49ffba6312c9.jpg",
        isVeg: true,
        category: "Premium Pizzas",
        isPopular: true
      },
      {
        id: "paneer-65",
        name: "Paneer 65",
        description: "Spicy paneer 65 with onions, peppers, and tandoori sauce",
        price: { medium: 499, large: 649 },
        image: "https://i.pinimg.com/736x/3c/b7/c1/3cb7c1650427e3afde160e971c2e25d7.jpg",
        isVeg: true,
        category: "Premium Pizzas"
      },
      {
        id: "chefs-cheese-special",
        name: "Chef's Cheese Special Pizza",
        description: "Chef's special blend of four premium cheeses",
        price: { medium: 549, large: 699 },
        image: "https://i.pinimg.com/736x/4e/f3/c0/4ef3c0d642b3608e621d89a25531cf6e.jpg",
        isVeg: true,
        category: "Premium Pizzas"
      }
    ]
  },
  {
    id: "burgers",
    name: "Burgers",
    description: "Juicy burgers with fresh ingredients",
    icon: "🍔",
    items: [
      {
        id: "aloo-tikki-burger",
        name: "Aloo Tikki Burger",
        description: "Crispy potato patty with fresh vegetables",
        price: { regular: 79 },
        image: "https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "veg-burger",
        name: "Veg Burger",
        description: "Classic vegetable patty burger",
        price: { regular: 89 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "cheese-burger",
        name: "Cheese Burger",
        description: "Veg patty with melted cheese",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/580612/pexels-photo-580612.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "paneer-burger",
        name: "Paneer Burger",
        description: "Grilled paneer patty with special sauce",
        price: { regular: 109 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "jain-special-burger",
        name: "Jain Special Burger",
        description: "Special burger without onion and garlic",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "paneer-tikka-burger",
        name: "Paneer Tikka Burger",
        description: "Tandoori paneer tikka with mint chutney",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "spicy-paneer-burger",
        name: "Spicy Paneer Burger",
        description: "Extra spicy paneer patty with jalapeños",
        price: { regular: 129 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Burgers"
      }
    ]
  },
  {
    id: "wraps",
    name: "Wraps",
    description: "Fresh wraps packed with flavor",
    icon: "🌯",
    items: [
      {
        id: "cheese-wrap",
        name: "Cheese Wrap",
        description: "Melted cheese with fresh vegetables in soft tortilla",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        isVeg: true,
        category: "Wraps"
      },
      {
        id: "paneer-wrap",
        name: "Paneer Wrap",
        description: "Grilled paneer with crunchy vegetables",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        isVeg: true,
        category: "Wraps"
      },
      {
        id: "veg-loaded-wrap",
        name: "Veg Loaded Wrap",
        description: "Loaded with fresh vegetables and special sauce",
        price: { regular: 129 },
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        isVeg: true,
        category: "Wraps"
      }
    ]
  },
  {
    id: "pasta",
    name: "Pasta",
    description: "Italian pasta with authentic sauces",
    icon: "🍝",
    items: [
      {
        id: "white-sauce-pasta",
        name: "White Sauce Pasta",
        description: "Creamy white sauce with herbs",
        price: { regular: 149 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "red-sauce-pasta",
        name: "Red Sauce Pasta",
        description: "Tangy tomato sauce with Italian herbs",
        price: { regular: 149 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "cheese-loaded-white-pasta",
        name: "Cheese Loaded White Pasta",
        description: "Extra cheese in creamy white sauce",
        price: { regular: 179 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "veg-loaded-white-pasta",
        name: "Veg Loaded White Pasta",
        description: "Fresh vegetables in creamy white sauce",
        price: { regular: 179 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "mix-sauce-pasta",
        name: "Mix Sauce Pasta",
        description: "Perfect blend of white and red sauce",
        price: { regular: 169 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Pasta"
      }
    ]
  },
  {
    id: "garlic-bread",
    name: "Garlic Bread",
    description: "Freshly baked garlic bread varieties",
    icon: "🧄",
    items: [
      {
        id: "garlic-bread-sticks",
        name: "Garlic Bread Sticks",
        description: "Crispy bread sticks with garlic butter",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "cheese-garlic-bread",
        name: "Cheese Garlic Bread",
        description: "Garlic bread topped with melted cheese",
        price: { regular: 129 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "spicy-garlic-bread",
        name: "Spicy Garlic Bread",
        description: "Garlic bread with spicy seasoning",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "stuffed-garlic-bread",
        name: "Stuffed Garlic Bread",
        description: "Garlic bread stuffed with cheese and vegetables",
        price: { regular: 149 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "paneer-tikka-garlic-bread",
        name: "Paneer Tikka Garlic Bread",
        description: "Garlic bread topped with paneer tikka",
        price: { regular: 169 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      }
    ]
  },
  {
    id: "sides",
    name: "Sides",
    description: "Perfect accompaniments to your meal",
    icon: "🍟",
    items: [
      {
        id: "zingy-paneer",
        name: "Zingy Paneer",
        description: "Crispy paneer with tangy seasoning",
        price: { regular: 149 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "paneer-popcorn",
        name: "Paneer Popcorn",
        description: "Bite-sized crispy paneer pieces",
        price: { regular: 139 },
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "french-fries",
        name: "French Fries",
        description: "Crispy golden french fries",
        price: { regular: 89 },
        image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "cheese-balls",
        name: "Cheese Balls",
        description: "Deep-fried cheese balls with herbs",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
        isVeg: true,
        category: "Sides"
      }
    ]
  },
  {
    id: "shakes",
    name: "Shakes",
    description: "Thick and creamy milkshakes",
    icon: "🥤",
    items: [
      {
        id: "vanilla-shake",
        name: "Vanilla Shake",
        description: "Classic vanilla milkshake",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg",
        isVeg: true,
        category: "Shakes"
      },
      {
        id: "strawberry-shake",
        name: "Strawberry Shake",
        description: "Fresh strawberry milkshake",
        price: { regular: 109 },
        image: "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg",
        isVeg: true,
        category: "Shakes"
      },
      {
        id: "butterscotch-shake",
        name: "Butterscotch Shake",
        description: "Rich butterscotch milkshake",
        price: { regular: 109 },
        image: "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg",
        isVeg: true,
        category: "Shakes"
      },
      {
        id: "chocolate-shake",
        name: "Chocolate Shake",
        description: "Decadent chocolate milkshake",
        price: { regular: 109 },
        image: "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg",
        isVeg: true,
        category: "Shakes"
      },
      {
        id: "oreo-shake",
        name: "Oreo Shake",
        description: "Cookies and cream milkshake",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg",
        isVeg: true,
        category: "Shakes"
      }
    ]
  },
  {
    id: "coffee",
    name: "Coffee",
    description: "Freshly brewed coffee beverages",
    icon: "☕",
    items: [
      {
        id: "cold-coffee",
        name: "Cold Coffee",
        description: "Chilled coffee with milk",
        price: { regular: 89 },
        image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
        isVeg: true,
        category: "Coffee"
      },
      {
        id: "cold-coffee-ice-cream",
        name: "Cold Coffee with Ice Cream",
        description: "Cold coffee topped with vanilla ice cream",
        price: { regular: 119 },
        image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
        isVeg: true,
        category: "Coffee"
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet endings to your meal",
    icon: "🍫",
    items: [
      {
        id: "chocolate-lava-cake",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center",
        price: { regular: 99 },
        image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "choco-lava-ice-cream",
        name: "Chocolate Lava with Ice Cream",
        description: "Chocolate lava cake served with vanilla ice cream",
        price: { regular: 129 },
        image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
        isVeg: true,
        category: "Desserts"
      }
    ]
  },
  {
    id: "dips",
    name: "Dips",
    description: "Perfect dips for your sides",
    icon: "🥫",
    items: [
      {
        id: "spicy-dip",
        name: "Spicy Dip",
        description: "Hot and spicy sauce",
        price: { regular: 20 },
        image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
        isVeg: true,
        category: "Dips"
      },
      {
        id: "mayo-dip",
        name: "Mayo Dip",
        description: "Creamy mayonnaise dip",
        price: { regular: 20 },
        image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
        isVeg: true,
        category: "Dips"
      }
    ]
  }
];

// Helper function to get all items
export const getAllMenuItems = (): MenuItem[] => {
  return menuData.flatMap(category => category.items);
};

// Helper function to get items by category
export const getItemsByCategory = (categoryId: string): MenuItem[] => {
  const category = menuData.find(cat => cat.id === categoryId);
  return category ? category.items : [];
};

// Helper function to get popular items
export const getPopularItems = (): MenuItem[] => {
  return getAllMenuItems().filter(item => item.isPopular);
};
