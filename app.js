/* =========================================================
   DEFAULT STATIC PRODUCTS
   Provides immediate product display before backend response
   ========================================================= */

const initialProducts = [
  {
    id: 1,
    name: "RGB Mechanical Keyboard",
    price: 85,
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Wireless Gaming Mouse",
    price: 50,
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Noise Cancelling Headphones",
    price: 120,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 4,
    name: "Gaming Earbuds",
    price: 45,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 5,
    name: "65W Fast Smart Charger",
    price: 30,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 6,
    name: "Ultra-Wide Gaming Monitor",
    price: 299,
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80"
  }
];


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let products = [...initialProducts];
let cart = [];
let currentAuthMode = 'login';
let currentUser = null;


/* =========================================================
   PRODUCT INITIALIZATION
   Loads static products first, then attempts backend fetch
   ========================================================= */

async function loadProducts() {
  // Render static products immediately
  renderProducts(products);

  try {
    const res = await fetch('http://localhost:5000/api/products');

    if (res.ok) {
      const data = await res.json();

      if (data && data.length > 0) {
        products = data;
        renderProducts(products);
      }
    }
  } catch (err) {
    console.log("Running in standalone Live Server mode.");
  }
}


/* =========================================================
   AUTHENTICATION
   ========================================================= */

/**
 * Switches between Login and Sign Up modes.
 */
function switchAuthMode(mode) {
  currentAuthMode = mode;

  document
    .getElementById('login-tab')
    .classList
    .toggle('active', mode === 'login');

  document
    .getElementById('signup-tab')
    .classList
    .toggle('active', mode === 'signup');

  document.getElementById('name-group').style.display =
    mode === 'signup' ? 'flex' : 'none';

  document.getElementById('auth-btn-text').innerText =
    mode === 'login' ? 'Login to Store' : 'Create Account';
}


/**
 * Handles login and sign-up form submission.
 */
function handleAuthSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('auth-email').value;

  const name =
    currentAuthMode === 'signup'
      ? document.getElementById('auth-name').value
      : email.split('@')[0];

  currentUser = {
    name,
    email
  };

  document.getElementById('active-user-name').innerText =
    currentUser.name;

  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('store-app').style.display = 'block';

  loadProducts();
}


/**
 * Logs the current user out of the store.
 */
function handleLogout() {
  currentUser = null;

  document.getElementById('store-app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
}


/* =========================================================
   PRODUCT RENDERING
   ========================================================= */

/**
 * Renders products inside the products grid.
 */
function renderProducts(items) {
  const grid = document.getElementById('products-grid');

  if (!grid) {
    return;
  }

  // Display message when no products match the filter
  if (items.length === 0) {
    grid.innerHTML = `
      <p style="grid-column: 1/-1; color: var(--text-muted);">
        No products found in this category.
      </p>
    `;

    return;
  }

  // Generate product cards
  grid.innerHTML = items
    .map(
      p => `
        <div class="product-card">
          <img
            src="${p.image}"
            alt="${p.name}"
            onerror="this.src='https://via.placeholder.com/200?text=Tech+Gear'"
          >

          <div>
            <h4>${p.name}</h4>
            <div class="price">$${p.price}</div>
          </div>

          <button
            class="add-btn"
            onclick="addToCart('${p.name}', ${p.price})"
          >
            Add To Cart
          </button>
        </div>
      `
    )
    .join('');
}


/* =========================================================
   SHOPPING CART
   ========================================================= */

/**
 * Adds a product to the shopping cart.
 * Increases quantity if the product already exists.
 */
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  updateCartUI();
  toggleCartDrawer(true);
}


/**
 * Updates the quantity of a cart item.
 */
function updateQuantity(index, delta) {
  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCartUI();
}


/**
 * Updates the cart counter, items and subtotal.
 */
function updateCartUI() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById('cart-count').innerText = totalItems;

  const container = document.getElementById('cart-items');

  container.innerHTML = cart
    .map(
      (item, index) => `
        <div class="cart-item-row">

          <div>
            <strong>${item.name}</strong>

            <div style="font-size: 12px; color: #94a3b8;">
              $${item.price} x ${item.quantity}
            </div>
          </div>

          <div class="qty-controls">

            <button
              class="qty-btn"
              onclick="updateQuantity(${index}, -1)"
            >
              -
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              class="qty-btn"
              onclick="updateQuantity(${index}, 1)"
            >
              +
            </button>

          </div>

        </div>
      `
    )
    .join('');

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  document.getElementById('cart-total').innerText =
    `$${subtotal.toFixed(2)}`;
}


/**
 * Opens or toggles the shopping cart drawer.
 */
function toggleCartDrawer(forceOpen = false) {
  const drawer = document.getElementById('cart-drawer');

  if (forceOpen) {
    drawer.classList.add('open');
  } else {
    drawer.classList.toggle('open');
  }
}


/* =========================================================
   CHECKOUT
   ========================================================= */

/**
 * Opens the dedicated checkout view.
 */
function goToCheckout() {
  if (cart.length === 0) {
    return alert("Your cart is empty!");
  }

  toggleCartDrawer(false);

  document.getElementById('shop-view').style.display = 'none';
  document.getElementById('checkout-view').style.display = 'block';

  const summaryList = document.getElementById(
    'checkout-summary-list'
  );

  summaryList.innerHTML = cart
    .map(
      item => `
        <div class="summary-line">
          <span>
            ${item.name} (x${item.quantity})
          </span>

          <span>
            $${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      `
    )
    .join('');

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  document.getElementById('summary-subtotal').innerText =
    `$${total.toFixed(2)}`;

  document.getElementById('summary-total').innerText =
    `$${total.toFixed(2)}`;
}


/**
 * Returns the user from checkout to the shop view.
 */
function showShopView() {
  document.getElementById('checkout-view').style.display = 'none';
  document.getElementById('shop-view').style.display = 'grid';
}


/**
 * Processes the final order and sends it to the backend.
 */
async function processFinalOrder(e) {
  e.preventDefault();

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  try {
    await fetch('http://localhost:5000/api/orders', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        cart,
        total,
        user: currentUser
      })
    });
  } catch (err) {
    console.log("Order processed locally.");
  }

  const orderId = Math.floor(
    100000 + Math.random() * 900000
  );

  alert(
    `🎉 Order Placed Successfully!\n\n` +
    `Order ID: #${orderId}\n` +
    `Thank you, ${currentUser ? currentUser.name : 'Customer'}!`
  );

  cart = [];

  updateCartUI();
  showShopView();
}


/* =========================================================
   CATEGORY FILTERING & SEARCH
   ========================================================= */

/**
 * Filters products by category.
 */
function filterCategory(cat, el) {
  document
    .querySelectorAll('.category-list li')
    .forEach(li => li.classList.remove('active'));

  el.classList.add('active');

  const filtered =
    cat === 'all'
      ? products
      : products.filter(
          p => p.category.toLowerCase() === cat.toLowerCase()
        );

  renderProducts(filtered);
}


/**
 * Filters products based on the search input.
 */
function filterProducts() {
  const val = document
    .getElementById('search-input')
    .value
    .toLowerCase();

  renderProducts(
    products.filter(
      p => p.name.toLowerCase().includes(val)
    )
  );
}