const orders = [
  {
    id: "SS-48213",
    date: "Aug 02, 2026",
    status: "In Transit",
    total: 29062,
    items: [
      {
        id: 3,
        name: "Essential Sneakers",
        category: "Sneakers",
        price: 7490,
        quantity: 2,
        selectedSize: "8",
        selectedColour: "Black",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: 12,
        name: "Structured Crossbody Bag",
        category: "Bags",
        price: 6290,
        quantity: 1,
        selectedColour: "Brown",
        image:
          "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: 1,
        name: "Classic Linen Shirt",
        category: "Shirts",
        price: 5990,
        quantity: 1,
        selectedSize: "M",
        selectedColour: "White",
        image:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },

  {
    id: "SS-47950",
    date: "Jul 21, 2026",
    status: "Delivered",
    total: 15400,
    items: [
      {
        id: 5,
        name: "Relaxed Cotton Dress",
        category: "Dresses",
        price: 8490,
        quantity: 1,
        selectedSize: "M",
        selectedColour: "Olive",
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },

  {
    id: "SS-47602",
    date: "Jul 09, 2026",
    status: "Delivered",
    total: 23400,
    items: [
      {
        id: 11,
        name: "Canvas Everyday Sneakers",
        category: "Sneakers",
        price: 6990,
        quantity: 1,
        selectedSize: "9",
        selectedColour: "Black",
        image:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: 8,
        name: "Leather Casual Shoes",
        category: "Loafers",
        price: 9490,
        quantity: 1,
        selectedSize: "9",
        selectedColour: "Brown",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },

  {
    id: "SS-46888",
    date: "Jun 28, 2026",
    status: "Processing",
    total: 10200,
    items: [
      {
        id: 8,
        name: "Leather Casual Shoes",
        category: "Loafers",
        price: 9490,
        quantity: 1,
        selectedSize: "8",
        selectedColour: "Brown",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
      },
    ],
  },
];

export default orders;