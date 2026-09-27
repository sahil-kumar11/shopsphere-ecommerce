const products = [
  // =========================
  // EXISTING PRODUCTS
  // =========================

  {
    id: 1,
    name: "Classic Linen Shirt",
    category: "Shirts",
    gender: "Men",
    price: 5990,
    oldPrice: 7990,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Black", "Blue"],
    description:
      "A lightweight linen shirt designed for everyday comfort and effortless style. Its clean silhouette makes it perfect for both casual and smart-casual looks.",
  },

  {
    id: 2,
    name: "Minimal Leather Bag",
    category: "Bags",
    gender: "Accessories",
    price: 8990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A minimal leather bag with a clean modern design. Spacious enough for everyday essentials while maintaining a refined and sophisticated look.",
  },

  {
    id: 3,
    name: "Essential Sneakers",
    category: "Sneakers",
    gender: "Footwear",
    price: 7490,
    oldPrice: 9990,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "White", "Red"],
    description:
      "Everyday sneakers designed for comfort and versatility. A timeless silhouette that works effortlessly with casual outfits.",
  },

  {
    id: 4,
    name: "Oversized Cotton Blazer",
    category: "Blazers",
    gender: "Women",
    price: 11990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "Cream", "Brown"],
    description:
      "A contemporary oversized cotton blazer designed to bring structure and effortless style to your wardrobe.",
  },

  {
    id: 5,
    name: "Relaxed Cotton Dress",
    category: "Dresses",
    gender: "Women",
    price: 8490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "White", "Olive"],
    description:
      "A relaxed cotton dress made for comfortable everyday wear. Its simple silhouette makes it an easy choice for warm days and casual occasions.",
  },

  {
    id: 6,
    name: "Classic Oxford Shirt",
    category: "Shirts",
    gender: "Men",
    price: 6490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Blue", "Black"],
    description:
      "A classic Oxford shirt featuring a clean design and comfortable fit. A versatile wardrobe essential for everyday and smart-casual outfits.",
  },

  {
    id: 7,
    name: "Everyday Shoulder Bag",
    category: "Bags",
    gender: "Accessories",
    price: 7290,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A practical shoulder bag designed for everyday use. Its compact yet functional design makes it ideal for carrying your daily essentials.",
  },

  {
    id: 8,
    name: "Leather Casual Shoes",
    category: "Loafers",
    gender: "Footwear",
    price: 9490,
    oldPrice: 10990,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "Classic leather casual shoes combining comfort with a refined design. Perfect for smart-casual outfits and everyday occasions.",
  },

  {
    id: 9,
    name: "Premium Denim Jacket",
    category: "Jackets",
    gender: "Men",
    price: 8990,
    oldPrice: 10990,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Blue", "Black"],
    description:
      "A premium denim jacket with a timeless design. Easy to layer and built to complement casual everyday outfits.",
  },

  {
    id: 10,
    name: "Classic Cotton Polo",
    category: "T-Shirts",
    gender: "Men",
    price: 3990,
    oldPrice: 4990,
    image:
      "https://images.unsplash.com/photo-1625910513413-5fc45e8c2c95?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Black", "Navy"],
    description:
      "A classic cotton polo designed for comfortable everyday wear with a clean and timeless silhouette.",
  },

  {
    id: 11,
    name: "Canvas Everyday Sneakers",
    category: "Sneakers",
    gender: "Footwear",
    price: 6990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "White", "Brown"],
    description:
      "Lightweight canvas sneakers designed for everyday comfort. A simple and versatile pair that fits naturally into casual wardrobes.",
  },

  {
    id: 12,
    name: "Structured Crossbody Bag",
    category: "Bags",
    gender: "Accessories",
    price: 6290,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    badge: null,
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A structured crossbody bag with a clean and modern profile. Designed to keep your essentials organized while adding a polished touch to your look.",
  },

  {
    id: 13,
    name: "Classic Chelsea Boots",
    category: "Boots",
    gender: "Footwear",
    price: 12490,
    oldPrice: 14990,
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "Brown"],
    description:
      "Classic Chelsea boots crafted for a refined everyday look. A versatile silhouette that works with both casual and smart outfits.",
  },

  {
    id: 14,
    name: "Woven Slide Sandals",
    category: "Sandals",
    gender: "Footwear",
    price: 4490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["7", "8", "9", "10"],
    colours: ["Cream", "Brown", "Black"],
    description:
      "Comfortable woven slide sandals designed for warm-weather days and relaxed everyday styling.",
  },

  {
    id: 15,
    name: "Tailored Wool Trousers",
    category: "Trousers",
    gender: "Men",
    price: 7990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["30", "32", "34", "36"],
    colours: ["Black", "Grey", "Navy"],
    description:
      "Tailored wool trousers with a clean modern cut. Designed for office wear, formal occasions, and elevated everyday outfits.",
  },

  {
    id: 16,
    name: "Relaxed Graphic T-Shirt",
    category: "T-Shirts",
    gender: "Men",
    price: 3290,
    oldPrice: 3990,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Black", "Grey"],
    description:
      "A relaxed graphic T-shirt made from soft cotton. An easy everyday essential for casual styling.",
  },

  {
    id: 17,
    name: "Minimal Knit Sweater",
    category: "Sweaters",
    gender: "Women",
    price: 6490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L"],
    colours: ["Cream", "Olive", "Black"],
    description:
      "A soft minimal knit sweater with a relaxed silhouette. Perfect for layering during cooler days.",
  },

  {
    id: 18,
    name: "Classic Leather Belt",
    category: "Accessories",
    gender: "Men",
    price: 2990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80",
    badge: null,
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "Brown"],
    description:
      "A timeless leather belt designed with a clean buckle and versatile finish for everyday wear.",
  },

  {
    id: 19,
    name: "Soft Cotton Hoodie",
    category: "Hoodies",
    gender: "Men",
    price: 5990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "Grey", "Cream"],
    description:
      "A soft cotton hoodie designed for comfortable everyday layering and relaxed streetwear looks.",
  },

  {
    id: 20,
    name: "Relaxed Everyday Blouse",
    category: "Blouses",
    gender: "Women",
    price: 5490,
    oldPrice: 6990,
    image:
      "https://images.unsplash.com/photo-1564257577054-0f5c8f2b4b5d?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Cream", "Black"],
    description:
      "A relaxed everyday blouse designed with a clean silhouette and lightweight fabric for comfortable styling.",
  },

  {
    id: 21,
    name: "Retro Court Trainer",
    category: "Sneakers",
    gender: "Footwear",
    price: 7990,
    oldPrice: 9490,
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["White", "Black", "Olive"],
    description:
      "A retro-inspired court trainer combining clean lines with everyday comfort and a timeless sporty aesthetic.",
  },

  {
    id: 22,
    name: "Suede Penny Loafer",
    category: "Loafers",
    gender: "Footwear",
    price: 8490,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Brown", "Black", "Tan"],
    description:
      "A refined suede penny loafer designed to add a sophisticated finish to smart-casual outfits.",
  },

  {
    id: 23,
    name: "Linen Wrap Dress",
    category: "Dresses",
    gender: "Women",
    price: 9490,
    oldPrice: 11990,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Cream", "Yellow", "Black"],
    description:
      "A lightweight linen wrap dress with an elegant silhouette designed for warm days and effortless occasions.",
  },

  {
    id: 24,
    name: "Everyday Canvas Backpack",
    category: "Bags",
    gender: "Accessories",
    price: 6990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["One Size"],
    colours: ["Black", "Olive", "Cream"],
    description:
      "A practical canvas backpack with enough space for everyday essentials, work accessories, and casual travel.",
  },

  {
    id: 25,
    name: "Classic Leather Boots",
    category: "Boots",
    gender: "Men",
    price: 13990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "Brown"],
    description:
      "Durable leather boots with a timeless silhouette designed for everyday wear and smart-casual outfits.",
  },

  {
    id: 26,
    name: "Platform Casual Sneakers",
    category: "Sneakers",
    gender: "Women",
    price: 7290,
    oldPrice: 8490,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["6", "7", "8", "9", "10"],
    colours: ["White", "Cream", "Black"],
    description:
      "Modern platform sneakers designed to provide everyday comfort with a subtle elevated silhouette.",
  },

  {
    id: 27,
    name: "Relaxed Linen Trousers",
    category: "Trousers",
    gender: "Women",
    price: 6990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Beige", "White", "Olive"],
    description:
      "Relaxed linen trousers designed for breathable comfort and effortless warm-weather styling.",
  },

  {
    id: 28,
    name: "Classic Everyday Blazer",
    category: "Blazers",
    gender: "Women",
    price: 9990,
    oldPrice: 12990,
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "Beige", "Brown"],
    description:
      "A polished everyday blazer designed with a relaxed fit for office looks and elevated casual styling.",
  },

  {
    id: 29,
    name: "Minimal Shoulder Bag",
    category: "Bags",
    gender: "Women",
    price: 7590,
    oldPrice: 8990,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A minimal shoulder bag designed for everyday use with a refined silhouette and practical interior space.",
  },

  {
    id: 30,
    name: "Summer Strap Sandals",
    category: "Sandals",
    gender: "Women",
    price: 3990,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    badge: "New",
    sizes: ["6", "7", "8", "9", "10"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "Lightweight strap sandals designed for warm-weather comfort and easy everyday styling.",
  },

  // =========================
  // ADDITIONAL SALE PRODUCTS
  // =========================

  {
    id: 31,
    name: "Premium Cotton Shirt",
    category: "Shirts",
    gender: "Men",
    price: 4990,
    oldPrice: 6990,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Blue", "Black"],
    description:
      "A premium cotton shirt with a clean silhouette and breathable construction for everyday comfort.",
  },

  {
    id: 32,
    name: "Relaxed Linen Shirt",
    category: "Shirts",
    gender: "Women",
    price: 4490,
    oldPrice: 6490,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["White", "Beige", "Olive"],
    description:
      "A relaxed linen shirt designed for warm-weather comfort and effortless everyday styling.",
  },

  {
    id: 33,
    name: "Classic Leather Handbag",
    category: "Bags",
    gender: "Women",
    price: 7990,
    oldPrice: 9990,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A classic leather handbag with a refined silhouette and enough space for everyday essentials.",
  },

  {
    id: 34,
    name: "Everyday Running Sneakers",
    category: "Sneakers",
    gender: "Men",
    price: 6490,
    oldPrice: 8490,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "White", "Red"],
    description:
      "Lightweight running-inspired sneakers designed for active everyday lifestyles and comfortable movement.",
  },

  {
    id: 35,
    name: "Soft Knit Cardigan",
    category: "Sweaters",
    gender: "Women",
    price: 5490,
    oldPrice: 7490,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L"],
    colours: ["Cream", "Grey", "Black"],
    description:
      "A soft knit cardigan designed for comfortable layering and elegant everyday outfits.",
  },

  {
    id: 36,
    name: "Classic Chino Trousers",
    category: "Trousers",
    gender: "Men",
    price: 5990,
    oldPrice: 7990,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["30", "32", "34", "36"],
    colours: ["Beige", "Black", "Navy"],
    description:
      "Classic chino trousers with a modern fit designed for casual and smart-casual occasions.",
  },

  {
    id: 37,
    name: "Elegant Midi Dress",
    category: "Dresses",
    gender: "Women",
    price: 7490,
    oldPrice: 9490,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["S", "M", "L", "XL"],
    colours: ["Black", "Red", "Cream"],
    description:
      "An elegant midi dress with a flattering silhouette suitable for dinners, events, and special occasions.",
  },

  {
    id: 38,
    name: "Leather Chelsea Boots",
    category: "Boots",
    gender: "Women",
    price: 10990,
    oldPrice: 13990,
    image:
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["6", "7", "8", "9", "10"],
    colours: ["Black", "Brown"],
    description:
      "Premium leather Chelsea boots designed with a timeless silhouette and comfortable everyday construction.",
  },

  {
    id: 39,
    name: "Classic Casual Loafers",
    category: "Loafers",
    gender: "Men",
    price: 6990,
    oldPrice: 8990,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["7", "8", "9", "10", "11"],
    colours: ["Black", "Brown", "Tan"],
    description:
      "Classic casual loafers designed with a refined silhouette for everyday smart-casual dressing.",
  },

  {
    id: 40,
    name: "Minimal Crossbody Bag",
    category: "Bags",
    gender: "Accessories",
    price: 4990,
    oldPrice: 6990,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    badge: "Sale",
    sizes: ["One Size"],
    colours: ["Black", "Brown", "Cream"],
    description:
      "A minimal crossbody bag designed for everyday essentials with a clean and versatile profile.",
  },
];


// =========================
// NEW ARRIVALS
// =========================

const newArrivals = products
  .filter((product) =>
    [40, 39, 38, 37, 36, 35].includes(product.id)
  )
  .slice(0, 6);


// =========================
// SALE PRODUCTS
// =========================

const saleProducts = products.filter(
  (product) =>
    product.oldPrice &&
    product.price < product.oldPrice
);


export {
  products,
  newArrivals,
  saleProducts,
};