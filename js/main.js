// main.js limpio con estructura clara y ordenada

document.addEventListener('DOMContentLoaded', () => {

  // --- VARIABLES Y ELEMENTOS DEL DOM ---
  const productDataElement = document.getElementById('product-data');
  const mainProductImage = document.getElementById('main-product-image');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const sizeButtons = document.querySelectorAll('.size-button');
  const quantityInput = document.getElementById('quantity-selector');
  const decrementQuantityBtn = document.querySelector('.quantity-button.decrement');
  const incrementQuantityBtn = document.querySelector('.quantity-button.increment');
  const addToCartButton = document.getElementById('add-to-cart-button');
  const cartConfirmationMessage = document.getElementById('cart-confirmation-message');
  const productTitleElement = document.querySelector('.product-title');
  const productPriceElement = document.querySelector('.product-price');
  const productArticleElement = document.querySelector('.product-article');
  const cartItemCountSpan = document.getElementById('cart-item-count');

  // Variables para la selección
  let productData = {};
  if (productDataElement) {
    try {
      productData = JSON.parse(productDataElement.dataset.images);
    } catch (e) {
      console.error('Error al cargar imágenes:', e);
    }
  }

  let selectedColor = Object.keys(productData)[0] || 'default';
  let currentImages = productData[selectedColor] || [];
  let currentImageIndex = 0;
  let selectedSize = '';

  // --- FUNCIONES DE LA GALERÍA DE IMÁGENES ---

  function updateMainImage() {
    if (!mainProductImage || currentImages.length === 0) return;
    mainProductImage.src = currentImages[currentImageIndex];
  }

  // --- EVENTOS DE NAVEGACIÓN ENTRE IMÁGENES (opcional) ---
  // Si querés flechas o miniaturas, se pueden agregar aquí

  // --- CAMBIO DE COLOR ---
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      selectedColor = swatch.dataset.color;
      currentImages = productData[selectedColor] || [];
      currentImageIndex = 0;
      updateMainImage();
    });
  });

  // --- CAMBIO DE TALLE ---
  sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      sizeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedSize = button.dataset.size;
    });
  });

  // --- CONTROL DE CANTIDAD ---
  decrementQuantityBtn?.addEventListener('click', () => {
    let val = parseInt(quantityInput.value);
    if (val > 1) quantityInput.value = val - 1;
  });

  incrementQuantityBtn?.addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // --- CARRITO: CARGAR, GUARDAR Y ACTUALIZAR CONTADOR ---
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCartCount() {
    if (!cartItemCountSpan) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCountSpan.innerText = totalItems;
    cartItemCountSpan.classList.toggle('hidden', totalItems === 0);
  }

  // --- AGREGAR AL CARRITO ---
  addToCartButton?.addEventListener('click', () => {
    const title = productTitleElement?.innerText || 'Producto';
    const priceText = productPriceElement?.innerText || '$0';
    const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace('.', '').replace(',', '.')) || 0;
    const article = productArticleElement?.innerText.replace('Artículo: ', '') || 'N/A';

    if (!selectedSize) {
      alert('Seleccioná un talle.');
      return;
    }

    const quantity = parseInt(quantityInput.value);
    const id = `prod-${title.replace(/\s+/g, '-').toLowerCase()}-${selectedColor}-${selectedSize}`;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id,
        title,
        price,
        quantity,
        color: selectedColor,
        size: selectedSize,
        image: mainProductImage?.src || '',
        article
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    if (cartConfirmationMessage) {
      cartConfirmationMessage.classList.remove('hidden');
      setTimeout(() => cartConfirmationMessage.classList.add('hidden'), 4000);
    }

    updateCartCount();
  });

  // --- INICIALIZACIÓN ---
  updateMainImage();
  updateCartCount();
});

// --- CÓDIGO PARA LA PÁGINA DEL CARRITO ---
// Lo podés incluir en main.js, pero se ejecutará solo si detecta el contenedor del carrito

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalDisplay = document.getElementById('cart-subtotal-display');
  const cartTotalDisplay = document.getElementById('cart-total-display');
  const clearCartButton = document.getElementById('clear-cart-button');

  if (!cartItemsList) return; // No estamos en la página carrito, salir

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p>El carrito está vacío.</p>';
      cartSubtotalDisplay.innerText = '$ 0,00';
      cartTotalDisplay.innerText = '$ 0,00';
      return;
    }

    let subtotal = 0;

    cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const cartItemDiv = document.createElement('div');
      cartItemDiv.classList.add('cart-item');
      cartItemDiv.innerHTML = `
        <div class="cart-item-product" style="display:flex; gap:10px; align-items:center;">
          <img src="${item.image}" alt="${item.title}" class="cart-item-image" style="width:80px; height:auto; object-fit:contain;">
          <div>
            <p><strong>${item.title}</strong></p>
            <p>Color: ${item.color}</p>
            <p>Talle: ${item.size}</p>
            <p>Artículo: ${item.article}</p>
          </div>
        </div>
        <div class="cart-item-price">$ ${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">${item.quantity}</div>
        <div class="cart-item-subtotal">$ ${itemSubtotal.toFixed(2)}</div>
      `;

      cartItemsList.appendChild(cartItemDiv);
    });

    cartSubtotalDisplay.innerText = `$ ${subtotal.toFixed(2)}`;
    cartTotalDisplay.innerText = `$ ${subtotal.toFixed(2)}`;
  }

  clearCartButton?.addEventListener('click', () => {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
  });

  renderCart();
});
