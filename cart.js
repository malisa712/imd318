// Cart Management System

// Initialize cart from localStorage
function initializeCart() {
  updateCartDisplay();
  updateCartBadge();
}

// Add item to cart
function addToCart(productName, price) {
  const cart = getCart();
  
  // Check if item already exists
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: parseFloat(price.replace('RM ', '')),
      quantity: 1
    });
  }
  
  saveCart(cart);
  updateCartBadge();
  
  // Show notification
  showNotification(`${productName} added to cart!`);
}

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('pastryCart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('pastryCart', JSON.stringify(cart));
}

// Update cart badge
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItems;
  }
}

// Update cart display
function updateCartDisplay() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cartItems');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>Add some delicious pastries to get started!</p>
        <a href="page2.html" class="btn btn-primary display-7">BACK TO MENU</a>
      </div>
    `;
    document.querySelector('.cart-summary').style.display = 'none';
    return;
  }
  
  document.querySelector('.cart-summary').style.display = 'block';
  
  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <div class="cart-item-details" style="flex: 1;">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
          <div class="quantity-control">
            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
            <div class="quantity-value">${item.quantity}</div>
            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <div style="text-align: right; min-width: 100px;">
          <div class="cart-item-price" style="font-size: 18px; margin-bottom: 10px;">RM ${(item.price * item.quantity).toFixed(2)}</div>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = html;
  updateSummary();
}

// Update quantity
function updateQuantity(index, change) {
  const cart = getCart();
  if (cart[index].quantity + change > 0) {
    cart[index].quantity += change;
    saveCart(cart);
    updateCartDisplay();
    updateCartBadge();
  } else if (change < 0) {
    removeFromCart(index);
  }
}

// Remove item from cart
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartDisplay();
  updateCartBadge();
}

// Update cart summary
function updateSummary() {
  const cart = getCart();
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5) : 0;
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;
  
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');
  
  if (subtotalEl) subtotalEl.textContent = `RM ${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `RM ${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `RM ${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `RM ${total.toFixed(2)}`;
}

// Continue shopping
function continueShopping() {
  window.location.href = 'page2.html';
}

// Proceed to checkout
function proceedToCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 16px 24px;
    border-radius: 6px;
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', initializeCart);
