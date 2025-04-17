// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON file safely
const readJSONFile = (filename) => {
  try {
    if (!fs.existsSync(filename)) return [];
    const fileContent = fs.readFileSync(filename, 'utf8');
    return fileContent.trim() ? JSON.parse(fileContent) : [];
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return []; // Ensure an empty array is returned in case of an error
  }
};

// Helper function to write JSON file safely
const writeJSONFile = (filename, data) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
};

// ---------------- LOGIN ROUTES ----------------

// GET all login data
app.get('/api/login', (req, res) => {
  try {
    const loginData = readJSONFile('login.json');
    res.json(loginData);
  } catch {
    res.status(500).json({ error: 'Failed to read login file' });
  }
});

// POST new login/signup data
app.post('/api/login', (req, res) => {
  try {
    const loginData = readJSONFile('login.json');

    if (req.body.name) {
      loginData.push(req.body);
      writeJSONFile('login.json', loginData);
      res.json({ message: 'Login data saved successfully' });
    } else {
      res.status(400).json({ error: 'Missing name field in request body' });
    }
  } catch (err) {
    console.error("Error saving login data:", err);
    res.status(500).json({ error: 'Failed to save login data' });
  }
});

// ---------------- CART ROUTES ----------------

// GET all cart items
app.get('/api/cart', (req, res) => {
  try {
    const cartData = readJSONFile('cart.json');
    res.json(cartData);
  } catch {
    res.status(500).json({ error: 'Failed to read cart file' });
  }
});

// POST new cart item
app.post('/api/cart', (req, res) => {
  try {
    const cartData = readJSONFile('cart.json');
    const { itemId, itemName, quantity, price } = req.body;

    if (!itemId || !itemName || !quantity || !price) {
      return res.status(400).json({ error: 'Missing item fields' });
    }

    cartData.push({ itemId, itemName, quantity, price });
    writeJSONFile('cart.json', cartData);
    res.json({ message: 'Item added to cart successfully' });
  } catch (err) {
    console.error("Error saving cart data:", err);
    res.status(500).json({ error: 'Failed to save cart data' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const orders = readJSONFile('orders.json');
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Failed to read orders file' });
  }
});

// POST new order
app.post('/api/orders', (req, res) => {
  try {
    const orders = readJSONFile('orders.json');
    const { userId, items, total, shippingAddress, status } = req.body;

    if (!userId || !items || !total || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const newOrder = {
      id: Date.now().toString(),
      userId,
      items,
      total,
      shippingAddress,
      status: status || 'Processing',
      date: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJSONFile('orders.json', orders);
    res.json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
