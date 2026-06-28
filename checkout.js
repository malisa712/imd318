// Checkout System

let selectedPaymentMethod = '';

// Initialize checkout page
function initializeCheckout() {
  loadOrderSummary();
  updateCartBadge();
}

// Load order summary
function loadOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('checkoutOrderItems');
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="color: #999;">No items in cart</p>';
    return;
  }
  
  let subtotal = 0;
  let html = '';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    html += `
      <div class="review-item">
        <span>${item.name} × ${item.quantity}</span>
        <span>RM ${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });
  
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5) : 0;
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;
  
  html += `
    <div class="review-item" style="color: #999; font-size: 14px; padding-top: 15px;">
      <span>Subtotal</span>
      <span>RM ${subtotal.toFixed(2)}</span>
    </div>
    <div class="review-item" style="color: #999; font-size: 14px;">
      <span>Shipping</span>
      <span>RM ${shipping.toFixed(2)}</span>
    </div>
    <div class="review-item" style="color: #999; font-size: 14px;">
      <span>Tax (6%)</span>
      <span>RM ${tax.toFixed(2)}</span>
    </div>
    <div class="review-total">
      <span>Total</span>
      <span>RM ${total.toFixed(2)}</span>
    </div>
  `;
  
  container.innerHTML = html;
}

// Get cart from localStorage
function getCart() {
  const cart = localStorage.getItem('pastryCart');
  return cart ? JSON.parse(cart) : [];
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

// Select payment method
function selectPayment(method, element) {
  // Remove previous selection
  document.querySelectorAll('.payment-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selection to clicked element
  element.classList.add('selected');
  selectedPaymentMethod = method;
  document.getElementById('selectedPayment').value = method;
  
  // Show/hide credit card section
  const creditCardSection = document.getElementById('creditCardSection');
  if (method === 'credit-card') {
    creditCardSection.style.display = 'block';
  } else {
    creditCardSection.style.display = 'none';
  }
}

// Validate form
function validateCheckoutForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const postcode = document.getElementById('postcode').value.trim();
  
  if (!firstName || !lastName || !email || !phone || !address || !city || !postcode) {
    alert('Please fill in all required fields');
    return false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return false;
  }
  
  if (!selectedPaymentMethod) {
    alert('Please select a payment method');
    return false;
  }
  
  // Validate credit card if selected
  if (selectedPaymentMethod === 'credit-card') {
    const cardName = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();
    
    if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
      alert('Please fill in all card details');
      return false;
    }
    
    // Card number validation (basic)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Card number must be 16 digits');
      return false;
    }
    
    // CVV validation
    if (cardCVV.length !== 3) {
      alert('CVV must be 3 digits');
      return false;
    }
  }
  
  return true;
}

// Process payment
function processPayment() {
  if (!validateCheckoutForm()) {
    return;
  }
  
  // Get form data
  const orderData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    postcode: document.getElementById('postcode').value,
    paymentMethod: selectedPaymentMethod,
    orderDate: new Date().toLocaleString(),
    items: getCart()
  };
  
  // Calculate total
  let subtotal = 0;
  orderData.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5) : 0;
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;
  
  orderData.subtotal = subtotal;
  orderData.shipping = shipping;
  orderData.tax = tax;
  orderData.total = total;
  
  // Save order to localStorage
  let orders = JSON.parse(localStorage.getItem('pastryOrders') || '[]');
  orders.push(orderData);
  localStorage.setItem('pastryOrders', JSON.stringify(orders));
  
  // Clear cart
  localStorage.removeItem('pastryCart');
  
  // Show success message
  showSuccessMessage();
  
  // Redirect after 3 seconds
  setTimeout(() => {
    window.location.href = 'page2.html';
  }, 3000);
}

// Show success message
function showSuccessMessage() {
  const successMessage = document.getElementById('successMessage');
  successMessage.style.display = 'block';
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go back to cart
function goBackToCart() {
  window.location.href = 'cart.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeCheckout);

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = formattedValue;
    });
  }
  
  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }
  
  const cardCVVInput = document.getElementById('cardCVV');
  if (cardCVVInput) {
    cardCVVInput.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
  }
});
