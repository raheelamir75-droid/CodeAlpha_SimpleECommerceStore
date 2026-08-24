const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();


/* =========================================================
   MIDDLEWARE
   ========================================================= */

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());


/* =========================================================
   STATIC FILES
   Serve Frontend Files and Product Images
   ========================================================= */

// Serve frontend files
app.use(express.static(path.join(__dirname, '../')));

// Serve product images
app.use(
  '/Images',
  express.static(path.join(__dirname, '../Images'))
);


/* =========================================================
   SAMPLE PRODUCT DATA
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Smart Charger",
    price: 15,
    image: "/Images/charger.jpg"
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    price: 45,
    image: "/Images/earbuds.jpg"
  },
  {
    id: 3,
    name: "Gaming Headphones",
    price: 60,
    image: "/Images/headphones.jpg"
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    price: 80,
    image: "/Images/keyboard.jpg"
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 25,
    image: "/Images/mouse.jpg"
  },
  {
    id: 6,
    name: "Smartwatch",
    price: 110,
    image: "/Images/smartwatch.jpg"
  }
];


/* =========================================================
   PRODUCT ROUTES
   ========================================================= */

/**
 * Get all available products.
 */
app.get('/api/products', (req, res) => {
  res.json(products);
});


/* =========================================================
   ORDER API
   ========================================================= */

/**
 * Create a new order.
 */
app.post('/api/orders', (req, res) => {
  const { cart, total } = req.body;

  // Validate cart
  if (!cart || cart.length === 0) {
    return res.status(400).json({
      message: "Cart is empty!"
    });
  }

  // Return successful order response
  res.status(201).json({
    message: "Order placed successfully!",
    orderId: Date.now()
  });
});


/* =========================================================
   SERVER CONFIGURATION
   ========================================================= */

const PORT = 5000;


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});