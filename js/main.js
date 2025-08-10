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
    const cartItemCountSpan = document.getElementById('cart-item-count'); // Elemento del contador en el header
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotalDisplay = document.getElementById('cart-subtotal-display');
    const cartTotalDisplay = document.getElementById('cart-total-display');
    const clearCartButton = document.getElementById('clear-cart-button');

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

    // --- LÓGICA DEL CARRITO: CARGAR, GUARDAR Y ACTUALIZAR ---
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

    // --- CÓDIGO PARA LA PÁGINA DEL CARRITO (UNIFICADO) ---
    if (cartItemsList) { // Si estamos en la página del carrito...
        
        function renderCart() {
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<p class="cart-empty-message">El carrito está vacío.</p>';
                if (cartSubtotalDisplay) cartSubtotalDisplay.innerText = '$ 0,00';
                if (cartTotalDisplay) cartTotalDisplay.innerText = '$ 0,00';
                return;
            }
            
            let subtotal = 0;

            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;
                
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <div class="cart-item-product">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                        <div>
                            <h4>${item.title}</h4>
                            <p>Artículo: ${item.article}</p>
                            <p>Color: ${item.color}</p>
                            <p>Talle: ${item.size}</p>
                        </div>
                    </div>
                    <div class="cart-item-price">$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity-control">
                        <button class="quantity-button decrement" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" readonly class="quantity-input">
                        <button class="quantity-button increment" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-subtotal">$ ${itemSubtotal.toFixed(2)}</div>
                    <div class="cart-item-remove">
                         <button class="remove-item-button" data-id="${item.id}">✕</button>
                    </div>
                `;
                cartItemsList.appendChild(cartItemDiv);
            });
            
            if (cartSubtotalDisplay) cartSubtotalDisplay.innerText = `$ ${subtotal.toFixed(2)}`;
            if (cartTotalDisplay) cartTotalDisplay.innerText = `$ ${subtotal.toFixed(2)}`;
        }

        // Manejador de eventos para los botones del carrito
        cartItemsList.addEventListener('click', (e) => {
            const button = e.target;
            const id = button.dataset.id;
            
            if (!id) return;
            
            const itemIndex = cart.findIndex(item => item.id === id);

            if (itemIndex > -1) {
                if (button.classList.contains('increment')) {
                    cart[itemIndex].quantity++;
                } else if (button.classList.contains('decrement')) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    }
                } else if (button.classList.contains('remove-item-button')) {
                    cart.splice(itemIndex, 1);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            }
        });

        clearCartButton?.addEventListener('click', () => {
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            renderCart();
        });

        // Al cargar la página del carrito, renderiza los productos
        renderCart();
    }


    // --- INICIALIZACIÓN DE LA PÁGINA ---
    updateMainImage();
    updateCartCount();

});