// Complete Restaurant Menu Data

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: {
    small?: number;
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
        price: { small: 110, medium: 220, large: 350 },
        image: "/vegmenuimage/cheese pizza.jpeg",
        isVeg: true,
        category: "Classic Pizzas",
        isPopular: true
      },
      {
        id: "chicken-crunch",
        name: "Chicken Crunch",
        description: "Crunchy chicken topping with mozzarella and special seasoning",
        price: { small: 200, medium: 320, large: 420 },
        image: "/nonvegmenu/Chicken Crunch.jpg",
        isVeg: false,
        category: "Classic Pizzas"
      },
      {
        id: "chicken-golden",
        name: "Chicken Golden",
        description: "Golden chicken topping with cheese and herbs",
        price: { small: 200, medium: 320, large: 420 },
        image: "/nonvegmenu/Zesty Chicken.jpg",
        isVeg: false,
        category: "Classic Pizzas"
      }
    ]
  },
  {
    id: "favourite-pizzas",
    name: "Favourite Pizzas",
    description: "Fan favorites with bold flavors",
    icon: "🍕",
    items: [
      {
        id: "cheese-n-corn",
        name: "Cheese n Corn",
        description: "Sweet corn kernels with creamy cheese blend",
        price: { small: 160, medium: 350, large: 450 },
        image: "/vegmenuimage/Corn Pizza.jpeg",
        isVeg: true,
        category: "Favourite Pizzas"
      },
      {
        id: "onion-capsicum",
        name: "Onion Capsicum",
        description: "Fresh bell peppers and onions with mozzarella cheese",
        price: { small: 160, medium: 350, large: 450 },
        image: "/vegmenuimage/Onion Pizza.jpg",
        isVeg: true,
        category: "Favourite Pizzas"
      },
      {
        id: "cheese-n-tomato",
        name: "Cheese n Tomato",
        description: "Fresh tomatoes with premium cheese blend",
        price: { small: 160, medium: 350, large: 450 },
        image: "/vegmenuimage/cheese pizza.jpeg",
        isVeg: true,
        category: "Favourite Pizzas"
      },
      {
        id: "chicken-mexican",
        name: "Chicken Mexican",
        description: "Mexican-style chicken toppings with spicy sauce and cheese",
        price: { small: 240, medium: 360, large: 480 },
        image: "/nonvegmenu/Chicken Mexican.jpg",
        isVeg: false,
        category: "Favourite Pizzas"
      },
      {
        id: "chilly-chicken-hot-fire",
        name: "Chilly Chicken Hot Fire",
        description: "Hot and fiery chilly chicken with extra spice and cheese",
        price: { small: 240, medium: 360, large: 480 },
        image: "/nonvegmenu/Chilly Chicken Hot Fire.jpg",
        isVeg: false,
        category: "Favourite Pizzas"
      }
    ]
  },
  {
    id: "tasty-pizzas",
    name: "Tasty Pizzas",
    description: "Delicious pizzas for every craving",
    icon: "🍕",
    items: [
      {
        id: "double-cheese",
        name: "Double Cheese",
        description: "Extra cheese for cheese lovers",
        price: { small: 210, medium: 310, large: 460 },
        image: "/vegmenuimage/Double Cheese.jpg",
        isVeg: true,
        category: "Tasty Pizzas"
      },
      {
        id: "veg-loaded",
        name: "Veg Loaded",
        description: "Loaded with fresh vegetables and cheese",
        price: { small: 210, medium: 310, large: 460 },
        image: "/vegmenuimage/Veggie Pizza.jpeg",
        isVeg: true,
        category: "Tasty Pizzas"
      },
      {
        id: "veggie-pizza",
        name: "Veggie Pizza",
        description: "Classic vegetable delight",
        price: { small: 210, medium: 310, large: 460 },
        image: "/vegmenuimage/Capsicum Pizza.jpg",
        isVeg: true,
        category: "Tasty Pizzas"
      },
      {
        id: "jain-special",
        name: "Jain Special",
        description: "Special pizza without onion and garlic",
        price: { small: 210, medium: 310, large: 460 },
        image: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
        isVeg: true,
        category: "Tasty Pizzas"
      }
    ]
  },
  {
    id: "feast-pizzas",
    name: "Feast Pizzas",
    description: "Hearty pizzas for big cravings",
    icon: "🍕",
    items: [
      {
        id: "mexican-green",
        name: "Mexican Green",
        description: "Spicy Mexican green pizza with jalapeños",
        price: { small: 260, medium: 400, large: 560 },
        image: "/vegmenuimage/Veggie Pizza.jpeg",
        isVeg: true,
        category: "Feast Pizzas"
      },
      {
        id: "hot-n-spicy",
        name: "Hot N' Spicy",
        description: "Hot and spicy veg delight",
        price: { small: 260, medium: 400, large: 560 },
        image: "/vegmenuimage/Hot N' Spicy.jpg",
        isVeg: true,
        category: "Feast Pizzas"
      },
      {
        id: "peppy-paneer",
        name: "Peppy Paneer",
        description: "Delightful peppy paneer cubes with cheese",
        price: { small: 260, medium: 400, large: 560 },
        image: "/vegmenuimage/Achari Paneer Pizza.jpg",
        isVeg: true,
        category: "Feast Pizzas"
      },
      {
        id: "pepperoni-pizza",
        name: "Pepperoni Pizza",
        description: "Classic pepperoni with mozzarella and signature sauce",
        price: { small: 260, medium: 440, large: 560 },
        image: "/nonvegmenu/Pepperoni Pizza.jpg",
        isVeg: false,
        category: "Feast Pizzas"
      },
      {
        id: "bbq-chicken-pizza",
        name: "BBQ Chicken",
        description: "BBQ chicken with smoky sauce and cheese",
        price: { small: 260, medium: 440, large: 560 },
        image: "/nonvegmenu/bbq.jpg",
        isVeg: false,
        category: "Feast Pizzas"
      },
      {
        id: "chilly-chicken-pizza",
        name: "Chilly Chicken",
        description: "Chilly chicken with onions, peppers, and cheese",
        price: { small: 260, medium: 440, large: 560 },
        image: "/nonvegmenu/Chilly Chicken.jpg",
        isVeg: false,
        category: "Feast Pizzas"
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
        price: { small: 250, medium: 450, large: 650 },
        image: "/vegmenuimage/Himalayan Pizza Special.jpg",
        isVeg: true,
        category: "Delight Pizzas",
        isPopular: true
      },
      {
        id: "cheese-n-corn-delight",
        name: "Cheese n Corn Delight",
        description: "Premium corn with extra cheese and special seasoning",
        price: { small: 250, medium: 510, large: 660 },
        image: "/vegmenuimage/Corn Pizza.jpeg",
        isVeg: true,
        category: "Delight Pizzas"
      },
      {
        id: "achari-paneer",
        name: "Achari Paneer Pizza",
        description: "Tangy pickled paneer with Indian spices",
        price: { small: 250, medium: 510, large: 660 },
        image: "/vegmenuimage/Achari Paneer Pizza.jpg",
        isVeg: true,
        category: "Delight Pizzas"
      },
      {
        id: "kabab-n-chicken",
        name: "Kabab n Chicken Pizza",
        description: "Juicy chicken with kabab flavor, cheese, and herbs",
        price: { small: 280, medium: 540, large: 640 },
        image: "/nonvegmenu/Kabab n Chicken Pizza.jpg",
        isVeg: false,
        category: "Delight Pizzas"
      },
      {
        id: "zesty-chicken",
        name: "Zesty Chicken",
        description: "Zesty chicken topping with tangy sauce and cheese",
        price: { small: 280, medium: 540, large: 640 },
        image: "/nonvegmenu/Zesty Chicken.jpg",
        isVeg: false,
        category: "Delight Pizzas"
      },
      {
        id: "spicy-chicken-delight",
        name: "Spicy Chicken",
        description: "Spicy chicken with extra heat, herbs, and cheese",
        price: { small: 280, medium: 540, large: 640 },
        image: "/nonvegmenu/Spicy Chicken.jpg",
        isVeg: false,
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
        price: { medium: 560, large: 760 },
        image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg",
        isVeg: true,
        category: "Premium Pizzas",
        isPopular: true
      },
      {
        id: "veg-supreme",
        name: "Veg Supreme Pizza",
        description: "Loaded with fresh vegetables, olives, and premium cheese blend",
        price: { medium: 560, large: 760 },
        image: "/vegmenuimage/eg Supreme Pizz.jpeg",
        isVeg: true,
        category: "Premium Pizzas",
        isPopular: true
      },
      {
        id: "paneer-65",
        name: "Paneer 65",
        description: "Spicy paneer 65 with onions, peppers, and tandoori sauce",
        price: { medium: 560, large: 760 },
        image: "/vegmenuimage/Paneer Tikka Pizza.jpeg",
        isVeg: true,
        category: "Premium Pizzas"
      },
      {
        id: "chefs-cheese-special",
        name: "Chef's Cheese Special Pizza",
        description: "Chef's special blend of four premium cheeses",
        price: { medium: 560, large: 760 },
        image: "/vegmenuimage/cheese-loaded pizza.jpeg",
        isVeg: true,
        category: "Premium Pizzas"
      },
      {
        id: "the-monster-pizza",
        name: "The Monster Pizza",
        description: "A monster-sized chicken loaded pizza with premium toppings",
        price: { small: 310, medium: 580, large: 680 },
        image: "/nonvegmenu/The Monster Pizza.jpg",
        isVeg: false,
        category: "Premium Pizzas"
      },
      {
        id: "chicken-supreme",
        name: "Chicken Supreme",
        description: "Supreme chicken toppings with olives, peppers, and cheese",
        price: { small: 310, medium: 580, large: 680 },
        image: "/nonvegmenu/Spicy Chicken.jpg",
        isVeg: false,
        category: "Premium Pizzas"
      },
      {
        id: "chicken-tandoori",
        name: "Tandoori Pizza",
        description: "Tandoori chicken with Indian spices and cheese",
        price: { small: 310, medium: 580, large: 680 },
        image: "/nonvegmenu/Tandoori Pizza.jpg",
        isVeg: false,
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
        price: { regular: 50 },
        image: "/vegmenuimage/Aloo Tikki Burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "veg-burger",
        name: "Veg Burger",
        description: "Classic vegetable patty burger",
        price: { regular: 50 },
        image: "/vegmenuimage/burger.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "aloo-cheese-burger",
        name: "Aloo Cheese Burger",
        description: "Aloo patty with melted cheese",
        price: { regular: 70 },
        image: "https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "barbeque-burger",
        name: "Barbeque Burger",
        description: "Smoky barbeque flavored veg burger",
        price: { regular: 70 },
        image: "https://images.pexels.com/photos/580612/pexels-photo-580612.jpeg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "cheese-burger",
        name: "Cheese Burger",
        description: "Veg patty with melted cheese",
        price: { regular: 80 },
        image: "/vegmenuimage/Cheese Burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "spicy-cheese-burger",
        name: "Spicy Cheese Burger",
        description: "Extra spicy veg patty with melted cheese",
        price: { regular: 90 },
        image: "/vegmenuimage/Spicy Cheese Burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "paneer-burger",
        name: "Paneer Burger",
        description: "Grilled paneer patty with special sauce",
        price: { regular: 100 },
        image: "/vegmenuimage/panner burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "jain-special-paneer",
        name: "Jain Special Paneer",
        description: "Special paneer burger without onion and garlic",
        price: { regular: 100 },
        image: "/vegmenuimage/Jain Special Paneer.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "paneer-tikka-burger",
        name: "Paneer Tikka Burger",
        description: "Tandoori paneer tikka with mint chutney",
        price: { regular: 120 },
        image: "/vegmenuimage/Paneer Tikka Burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "spicy-paneer-burger",
        name: "Spicy Paneer Burger",
        description: "Extra spicy paneer patty with jalapeños",
        price: { regular: 150 },
        image: "/vegmenuimage/Spicy Paneer Burger.jpg",
        isVeg: true,
        category: "Burgers"
      },
      {
        id: "egg-burger",
        name: "Egg Burger",
        description: "Egg patty with fresh veggies and special sauce",
        price: { regular: 70 },
        image: "/nonvegmenu/egg burger.jpg",
        isVeg: false,
        category: "Burgers"
      },
      {
        id: "classic-chicken-burger",
        name: "Classic Chicken Burger",
        description: "Classic chicken patty burger with fresh vegetables",
        price: { regular: 95 },
        image: "/nonvegmenu/Classic Chicken Burger.jpg",
        isVeg: false,
        category: "Burgers"
      },
      {
        id: "chicken-cheese-burger",
        name: "Chicken Cheese Burger",
        description: "Chicken patty with melted cheese and signature sauce",
        price: { regular: 110 },
        image: "/nonvegmenu/Chicken Cheese Burger.jpg",
        isVeg: false,
        category: "Burgers"
      },
      {
        id: "chicken-spicy-burger",
        name: "Chicken Spicy Burger",
        description: "Spicy chicken patty with jalapeños and hot sauce",
        price: { regular: 140 },
        image: "/nonvegmenu/Chicken Spicy Burger.jpg",
        isVeg: false,
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
        price: { regular: 100 },
        image: "/nonvegmenu/Cheese Wrap.jpg",
        isVeg: true,
        category: "Wraps"
      },
      {
        id: "paneer-wrap",
        name: "Paneer Wrap",
        description: "Grilled paneer with crunchy vegetables",
        price: { regular: 120 },
        image: "/nonvegmenu/paneer wrap.jpg",
        isVeg: true,
        category: "Wraps"
      },
      {
        id: "veg-loaded-wrap",
        name: "Veg Loaded Wrap",
        description: "Loaded with fresh vegetables and special sauce",
        price: { regular: 150 },
        image: "/vegmenuimage/Veg Loaded Wrap.jpg",
        isVeg: true,
        category: "Wraps"
      },
      {
        id: "chicken-wrap",
        name: "Chicken Wrap",
        description: "Chicken filling with crunchy veggies in a soft wrap",
        price: { regular: 140 },
        image: "/nonvegmenu/Chicken Mexican.jpg",
        isVeg: false,
        category: "Wraps"
      },
      {
        id: "spicy-chicken-wrap",
        name: "Spicy Chicken Wrap",
        description: "Spicy chicken with hot sauce and fresh veggies",
        price: { regular: 160 },
        image: "/nonvegmenu/Spicy Chicken.jpg",
        isVeg: false,
        category: "Wraps"
      },
      {
        id: "chicken-loaded-wrap",
        name: "Chicken Loaded Wrap",
        description: "Loaded chicken wrap with extra cheese and sauce",
        price: { regular: 180 },
        image: "/nonvegmenu/Chicken Loaded Wrap.jpg",
        isVeg: false,
        category: "Wraps"
      }
    ]
  },
  {
    id: "sides",
    name: "Sides & Extras",
    description: "Perfect accompaniments to your meal",
    icon: "🍟",
    items: [
      {
        id: "zingy-paneer",
        name: "Zingy Paneer",
        description: "Crispy paneer with tangy seasoning",
        price: { regular: 60 },
        image: "/vegmenuimage/Zingy Paneer.jpg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "paneer-parcel",
        name: "Paneer Parcel",
        description: "Bite-sized crispy paneer parcels",
        price: { regular: 70 },
        image: "/vegmenuimage/paneer parcel.jpg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "french-fries",
        name: "French Fries",
        description: "Crispy golden french fries",
        price: { regular: 80 },
        image: "https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "peri-peri-fries",
        name: "Peri Peri Fries",
        description: "Spicy peri peri seasoned fries",
        price: { regular: 100 },
        image: "/vegmenuimage/Peri Peri Fries.jpg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "cheese-balls",
        name: "Cheese Balls",
        description: "Deep-fried cheese balls with herbs",
        price: { regular: 150 },
        image: "/vegmenuimage/Cheese Balls.jpg",
        isVeg: true,
        category: "Sides"
      },
      {
        id: "cheese-balls-mini",
        name: "Cheese Balls (Mini)",
        description: "Deep-fried cheese balls with herbs mini pack",
        price: { regular: 120 },
        image: "/vegmenuimage/Cheese Balls (Mini).jpg",
        isVeg: true,
        category: "Sides"
      }
    ]
  },
  {
    id: "shakes-mocktails",
    name: "Shakes & Mocktails",
    description: "Thick, creamy shakes and refreshing mocktails",
    icon: "🥤",
    items: [
      {
        id: "mojito",
        name: "Mojito",
        description: "Refreshing classic mint mojito",
        price: { regular: 150 },
        image: "/vegmenuimage/mojito.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "blue-lagoon",
        name: "Blue Lagoon",
        description: "Cool and refreshing blue lagoon mocktail",
        price: { regular: 150 },
        image: "/vegmenuimage/Blue Lagoon.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "vanilla-shake",
        name: "Vanilla Shake",
        description: "Classic vanilla milkshake",
        price: { regular: 170 },
        image: "/vegmenuimage/Vanilla Shake.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "butterscotch-shake",
        name: "Butterscotch Shake",
        description: "Rich butterscotch milkshake",
        price: { regular: 170 },
        image: "/vegmenuimage/Butterscotch Shake.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "pineapple-shake",
        name: "Pineapple Shake",
        description: "Fresh pineapple milkshake",
        price: { regular: 150 },
        image: "/vegmenuimage/Pineapple.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "strawberry-shake",
        name: "Strawberry Shake",
        description: "Fresh strawberry milkshake",
        price: { regular: 150 },
        image: "/vegmenuimage/Strawberry Shake.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "chocolate-shake",
        name: "Chocolate Shake",
        description: "Decadent chocolate milkshake",
        price: { regular: 150 },
        image: "/vegmenuimage/Chocolate Shake.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "black-currant-shake",
        name: "Black Currant Shake",
        description: "Rich black currant milkshake",
        price: { regular: 150 },
        image: "https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg",
        isVeg: true,
        category: "Shakes & Mocktails"
      },
      {
        id: "oreo-shake",
        name: "Oreo Shake",
        description: "Cookies and cream milkshake",
        price: { regular: 150 },
        image: "/vegmenuimage/Oreo Shake.jpg",
        isVeg: true,
        category: "Shakes & Mocktails"
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
        price: { regular: 100 },
        image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
        isVeg: true,
        category: "Coffee"
      },
      {
        id: "cold-coffee-ice-cream",
        name: "Cold Coffee with Ice Cream",
        description: "Cold coffee topped with vanilla ice cream",
        price: { regular: 120 },
        image: "/vegmenuimage/Cold Coffee with Ice Cream.jpg",
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
        name: "Chocolava Cake",
        description: "Warm chocolate cake with molten center",
        price: { regular: 70 },
        image: "/vegmenuimage/Chocolava Cake.jpg",
        isVeg: true,
        category: "Desserts"
      },
      {
        id: "choco-lava-ice-cream",
        name: "Chocolava with Ice Cream",
        description: "Chocolate lava cake served with vanilla ice cream",
        price: { regular: 180 },
        image: "/vegmenuimage/Chocolate Lava Cake.jpg",
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
        image: "/vegmenuimage/Spicy Dip.jpg",
        isVeg: true,
        category: "Dips"
      },
      {
        id: "cheese-dip",
        name: "Cheese Dip",
        description: "Creamy cheese dip",
        price: { regular: 20 },
        image: "/vegmenuimage/Mayo Dip.jpg",
        isVeg: true,
        category: "Dips"
      },
      {
        id: "red-sauce-dip",
        name: "Red Sauce Dip",
        description: "Tangy red sauce dip",
        price: { regular: 20 },
        image: "/vegmenuimage/Red Sauce Dip.jpg",
        isVeg: true,
        category: "Dips"
      },
      {
        id: "peri-peri-dip",
        name: "Peri Peri Dip",
        description: "Spicy peri peri dip",
        price: { regular: 20 },
        image: "/vegmenuimage/Peri Peri Dip.jpg",
        isVeg: true,
        category: "Dips"
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
        price: { regular: 180 },
        image: "/vegmenuimage/pasta.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "red-sauce-pasta",
        name: "Red Sauce Pasta",
        description: "Tangy tomato sauce with Italian herbs",
        price: { regular: 140 },
        image: "/vegmenuimage/Red Sauce Pasta.jpg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "cheese-loaded-white-pasta",
        name: "Cheese Loaded White Pasta",
        description: "Extra cheese in creamy white sauce",
        price: { regular: 180 },
        image: "/vegmenuimage/Cheese Loaded White Pasta.jpg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "veg-loaded-white-pasta",
        name: "Veg Loaded White Pasta",
        description: "Fresh vegetables in creamy white sauce",
        price: { regular: 180 },
        image: "/vegmenuimage/pasta.jpeg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "mix-sauce-pasta",
        name: "Mix Sauce Pasta",
        description: "Perfect blend of white and red sauce",
        price: { regular: 180 },
        image: "/vegmenuimage/mix sause pasta.jpg",
        isVeg: true,
        category: "Pasta"
      },
      {
        id: "chicken-pasta",
        name: "Chicken Pasta",
        description: "Creamy pasta loaded with tender chicken",
        price: { regular: 200 },
        image: "/nonvegmenu/Chicken Pasta.jpg",
        isVeg: false,
        category: "Pasta"
      },
      {
        id: "chicken-chilli-pasta",
        name: "Chicken Chilli Pasta",
        description: "Spicy chilli chicken pasta with signature seasoning",
        price: { regular: 200 },
        image: "/nonvegmenu/chiken chili pasta.jpg",
        isVeg: false,
        category: "Pasta"
      },
      {
        id: "red-chilli-pasta",
        name: "Red Chilli Pasta",
        description: "Hot red chilli pasta for spice lovers",
        price: { regular: 240 },
        image: "/nonvegmenu/Red Chilli Pasta.jpg",
        isVeg: false,
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
        price: { regular: 90 },
        image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "cheese-garlic-bread",
        name: "Cheese Garlic Bread",
        description: "Garlic bread topped with melted cheese",
        price: { regular: 170 },
        image: "/vegmenuimage/Cheese Garlic Bread.jpg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "spicy-garlic-bread",
        name: "Spicy Garlic Bread",
        description: "Garlic bread with spicy seasoning",
        price: { regular: 150 },
        image: "/vegmenuimage/Spicy Garlic Bread.jpg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "stuffed-garlic-bread",
        name: "Stuffed Garlic Bread",
        description: "Garlic bread stuffed with cheese and vegetables",
        price: { regular: 150 },
        image: "/vegmenuimage/stuffed chessy garlic bread.jpg",
        isVeg: true,
        category: "Garlic Bread"
      },
      {
        id: "paneer-tikka-garlic-bread",
        name: "Paneer Tikka Garlic Bread",
        description: "Garlic bread topped with paneer tikka",
        price: { regular: 150 },
        image: "/vegmenuimage/paneer bread.jpg",
        isVeg: true,
        category: "Garlic Bread"
      }
    ]
  }
];

export const getMenuItemImage = (item: MenuItem): string => {
  const image = (item.image || "").trim();
  if (!image) {
    return "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg";
  }

  if (
    image.startsWith("http://") || 
    image.startsWith("https://") || 
    image.startsWith("/") || 
    image.startsWith("data:image/") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `/${image}`;
};
