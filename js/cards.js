document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const subtotalPriceEl = document.getElementById('subtotal-price');
  const totalPriceEl = document.getElementById('total-price');
  const continueShoppingBtn = document.getElementById('continue-shopping-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Recuperar carrito del localStorage o crear uno vacío
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Función que actualiza el contador en header (desktop y mobile)
  function actualizarContadores() {
    const totalCantidad = cart.reduce((acc, item) => acc + item.quantity, 0);

    const desktopCount = document.getElementById("cart-count-desktop");
    const mobileCount = document.getElementById("cart-count-mobile");
    const desktopCount2 = document.getElementById("cart-item-count-desktop");

    if (desktopCount) desktopCount.textContent = totalCantidad;
    if (mobileCount) mobileCount.textContent = totalCantidad;
    if (desktopCount2) desktopCount2.textContent = totalCantidad;
  }

  // Función para renderizar el carrito en la página
  function renderCart() {
    cartItemsContainer.innerHTML = ''; // limpiar contenedor
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Tu carrito está vacío. ¡Añade productos para empezar!</p>';
    } else {
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItemEl = document.createElement('div');
        cartItemEl.classList.add('cart-item');
        cartItemEl.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p>Talle: ${item.size}</p>
            <p>Color: ${item.color}</p>
          </div>
          <div class="quantity-control">
            <button class="decrement-btn" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increment-btn" data-id="${item.id}">+</button>
          </div>
          <span class="item-price">$ ${itemTotal.toFixed(2)}</span>
          <button class="remove-btn" data-id="${item.id}">❌</button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
      });
    }

    subtotalPriceEl.textContent = `$ ${subtotal.toFixed(2)}`;
    totalPriceEl.textContent = `$ ${subtotal.toFixed(2)}`;

    actualizarContadores();
  }

  // Manejo de botones incrementar, decrementar y eliminar en el carrito
  cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target;
    const itemId = target.dataset.id;
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
      if (target.classList.contains('increment-btn')) {
        cart[itemIndex].quantity++;
      } else if (target.classList.contains('decrement-btn')) {
        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity--;
        } else {
          cart.splice(itemIndex, 1);
        }
      } else if (target.classList.contains('remove-btn')) {
        cart.splice(itemIndex, 1);
      }

      // Guardar carrito actualizado y renderizar
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  });

  // Botones de acción (seguir comprando y checkout)
  if(continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', () => {
      window.location.href = '../index.html'; // cambiar URL si querés
    });
  }

  if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length > 0) {
        alert('¡Gracias por tu compra! Redirigiendo a la pasarela de pago...');
      } else {
        alert('Tu carrito está vacío.');
      }
    });
  }

  // Función para agregar producto al carrito (usarla desde la página de producto)
  window.addToCart = function(product) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity++;
    } else {
      cart.push({...product, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  };

  // Renderizar carrito y contadores al iniciar
  renderCart();
});
