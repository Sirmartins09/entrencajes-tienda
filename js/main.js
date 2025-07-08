document.addEventListener('DOMContentLoaded', () => {
    // --- Datos de los productos (existente) ---
    const productData = {
        black: [
            '../assets/img/bata-negra-1.jpg',
            '../assets/img/bata-negra-2.jpg',
            '../assets/img/bata-negra-3.jpg'
        ],
        camel: [
            '../assets/img/bata-camel-1.jpg',
            '../assets/img/bata-camel-2.jpg',
            '../assets/img/bata-camel-3.jpg'
        ]
    };

    let selectedColor = 'camel';
    let currentImages = productData[selectedColor];
    let currentImageIndex = 0;

    // --- Elementos del DOM de la página de detalle (ajustado a tu HTML) ---
    const mainProductImage = document.getElementById('main-product-image');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const sizeButtons = document.querySelectorAll('.size-button');
    const quantityInput = document.getElementById('quantity-selector');
    const decrementQuantityBtn = document.querySelector('.quantity-button.decrement');
    const incrementQuantityBtn = document.querySelector('.quantity-button.increment');
    const addToCartButton = document.getElementById('add-to-cart-button');
    const cartConfirmationMessage = document.getElementById('cart-confirmation-message');

    // Elementos del DOM del PRODUCTO ESPECÍFICO A CAPTURAR (AJUSTADO)
    const productTitleElement = document.querySelector('.product-title'); // Ahora busca por la clase product-title
    const productPriceElement = document.querySelector('.product-price');
    const productArticleElement = document.querySelector('.product-article');

    // Elementos del DOM específicos para la página de carrito y contador
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSubtotalDisplay = document.getElementById('cart-subtotal-display');
    const cartTotalDisplay = document.getElementById('cart-total-display');
    const clearCartButton = document.getElementById('clear-cart-button');
    const notificationMessage = document.getElementById('notification-message');
    const checkoutButton = document.getElementById('checkout-button');
    const mercadoPagoButtonContainer = document.getElementById('mercado-pago-button-container');

    // Elemento del contador del carrito en la cabecera (en cualquier página)
    const cartItemCountSpan = document.getElementById('cart-item-count');

    // Detectar si estamos en la página del carrito
    const isCartPage = window.location.pathname.includes('carrito.html');

    // --- Funciones de la galería de imágenes (existente) ---
    function updateMainImage() {
        if (mainProductImage) {
            mainProductImage.src = currentImages[currentImageIndex];
            updateThumbnails();
            updateDots();
        }
    }

    function createThumbnails() {
        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = '';
            currentImages.forEach((src, i) => {
                const img = document.createElement('img');
                img.src = src;
                img.classList.add('thumbnail-item');
                if (i === currentImageIndex) img.classList.add('active');
                img.addEventListener('click', () => {
                    currentImageIndex = i;
                    updateMainImage();
                });
                thumbnailContainer.appendChild(img);
            });
        }
    }

    function updateThumbnails() {
        document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === currentImageIndex);
        });
    }

    function createDots() {
        if (galleryDotsContainer) {
            galleryDotsContainer.innerHTML = '';
            currentImages.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentImageIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentImageIndex = i;
                    updateMainImage();
                });
                galleryDotsContainer.appendChild(dot);
            });
        }
    }

    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentImageIndex);
        });
    }

    // Navegación de imágenes (existente)
    prevArrow?.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        updateMainImage();
    });

    nextArrow?.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        updateMainImage();
    });

    // CAMBIO DE COLOR (existente)
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            selectedColor = swatch.dataset.color;
            currentImages = productData[selectedColor];
            currentImageIndex = 0;
            updateMainImage();
            createThumbnails();
            createDots();
        });
    });

    // TALLE (existente)
    let selectedSize = '';
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedSize = button.dataset.size;
        });
    });

    // Cantidad (existente)
    decrementQuantityBtn?.addEventListener('click', () => {
        const val = parseInt(quantityInput.value);
        if (val > 1) quantityInput.value = val - 1;
    });

    incrementQuantityBtn?.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    // --- Lógica del Carrito con localStorage ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // AGREGAR AL CARRITO (MODIFICADA para usar tus clases HTML)
    addToCartButton?.addEventListener('click', () => {
        const productTitle = productTitleElement ? productTitleElement.innerText : 'Producto Desconocido';
        // Remueve "$" y reemplaza "," por "." antes de parsear a float
        const productPrice = productPriceElement ? parseFloat(productPriceElement.innerText.replace('$', '').replace('.', '').replace(',', '.')) : 0; //
        const productArticle = productArticleElement ? productArticleElement.innerText.replace('Artículo: ', '') : 'N/A';

        if (!selectedSize) {
            showNotification('Por favor, selecciona un talle.', 'error');
            return;
        }

        // Genera un ID único para el producto basado en sus atributos
        const productId = 'prod-' + productTitle.replace(/\s/g, '-').toLowerCase() + '-' + selectedColor + '-' + selectedSize;

        const productToAdd = {
            id: productId,
            title: productTitle,
            price: productPrice,
            quantity: parseInt(quantityInput.value),
            color: selectedColor,
            size: selectedSize,
            image: mainProductImage ? mainProductImage.src : '',
            article: productArticle
        };

        const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += productToAdd.quantity;
        } else {
            cart.push(productToAdd);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        console.log('Producto agregado al carrito:', productToAdd);
        console.log('Carrito actual:', cart);

        cartConfirmationMessage.classList.remove('hidden');
        setTimeout(() => {
            cartConfirmationMessage.classList.add('hidden');
        }, 5000);

        updateCartCount();

        const goToCartLink = document.querySelector('.go-to-cart-link');
        if (goToCartLink) {
            // Asegúrate que esta ruta sea correcta desde tu página de detalle a carrito.html
            goToCartLink.href = '../pages/carrito.html';
        }
    });


    // --- Lógica de la Página del Carrito (Solo si estamos en carrito.html) ---
    if (isCartPage) {
        renderCartItems();
        updateCartSummary();

        clearCartButton?.addEventListener('click', clearCart);
        checkoutButton?.addEventListener('click', createMercadoPagoCheckoutButton);
    }

    function renderCartItems() {
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
            if (clearCartButton) clearCartButton.style.display = 'none';
            if (checkoutButton) checkoutButton.style.display = 'none';
            if (mercadoPagoButtonContainer) mercadoPagoButtonContainer.innerHTML = '';
            return;
        } else {
            if (clearCartButton) clearCartButton.style.display = 'block';
            if (checkoutButton) checkoutButton.style.display = 'block';
        }

        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.id = item.id;

            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image-col">
                <div class="cart-item-details">
                    <p class="cart-item-title">${item.title}</p>
                    <p class="cart-item-info">Color: ${item.color} | Talle: ${item.size}</p>
                    <p class="cart-item-info">Art: ${item.article}</p>
                </div>
                <p class="cart-item-price">$ ${formatPrice(item.price)}</p>
                <div class="quantity-control-cart">
                    <button class="quantity-button-cart decrement-cart" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input-cart" data-id="${item.id}">
                    <button class="quantity-button-cart increment-cart" data-id="${item.id}">+</button>
                </div>
                <p class="cart-item-subtotal">$ ${formatPrice(item.price * item.quantity)}</p>
                <button class="remove-item-button" data-id="${item.id}">&times;</button>
            `;
            cartItemsList.appendChild(cartItemDiv);
        });

        addCartItemEventListeners();
    }

    function addCartItemEventListeners() {
        document.querySelectorAll('.quantity-button-cart').forEach(button => {
            button.removeEventListener('click', handleCartQuantityChange);
            button.addEventListener('click', handleCartQuantityChange);
        });

        document.querySelectorAll('.quantity-input-cart').forEach(input => {
            input.removeEventListener('change', handleCartQuantityInput);
            input.addEventListener('change', handleCartQuantityInput);
        });

        document.querySelectorAll('.remove-item-button').forEach(button => {
            button.removeEventListener('click', removeItemFromCart);
            button.addEventListener('click', removeItemFromCart);
        });
    }

    function handleCartQuantityChange(event) {
        const button = event.currentTarget;
        const itemId = button.dataset.id;
        const input = document.querySelector(`.quantity-input-cart[data-id="${itemId}"]`);
        let newQuantity = parseInt(input.value);

        if (button.classList.contains('decrement-cart')) {
            newQuantity = Math.max(1, newQuantity - 1);
        } else if (button.classList.contains('increment-cart')) {
            newQuantity++;
        }
        updateCartItemQuantity(itemId, newQuantity);
    }

    function handleCartQuantityInput(event) {
        const input = event.currentTarget;
        const itemId = input.dataset.id;
        let newQuantity = parseInt(input.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        updateCartItemQuantity(itemId, newQuantity);
    }

    function updateCartItemQuantity(id, newQuantity) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartSummary();
            updateCartCount();
        }
    }

    function removeItemFromCart(event) {
        const itemId = event.currentTarget.dataset.id;
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartSummary();
        updateCartCount();
        showNotification('Producto eliminado del carrito.', 'success');
    }

    function clearCart() {
        if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
            cart = [];
            localStorage.removeItem('cart');
            renderCartItems();
            updateCartSummary();
            updateCartCount();
            showNotification('Carrito vaciado con éxito.', 'success');
            if (mercadoPagoButtonContainer) mercadoPagoButtonContainer.innerHTML = '';
        }
    }

    function updateCartSummary() {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        cartSubtotalDisplay.innerText = `$ ${formatPrice(subtotal)}`;
        cartTotalDisplay.innerText = `$ ${formatPrice(subtotal)}`;
    }

    function formatPrice(price) {
        return price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function showNotification(message, type = 'success') {
        if (!notificationMessage) return; // Asegurarse de que el elemento exista
        notificationMessage.innerText = message;
        notificationMessage.className = `notification-message ${type}`;
        notificationMessage.classList.remove('hidden');

        setTimeout(() => {
            notificationMessage.classList.add('hidden');
        }, 3000);
    }

    // --- Función para actualizar el contador de ítems en la cabecera ---
    function updateCartCount() {
        if (cartItemCountSpan) {
            let totalItemsInCart = 0;
            cart.forEach(item => {
                totalItemsInCart += item.quantity;
            });
            cartItemCountSpan.innerText = totalItemsInCart;

            if (totalItemsInCart === 0) {
                cartItemCountSpan.classList.add('hidden');
            } else {
                cartItemCountSpan.classList.remove('hidden');
            }
        }
    }

    // --- Integración con Mercado Pago ---
    // !!! IMPORTANTE: Reemplaza con tus PUBLIC_KEY y ACCESS_TOKEN de PRUEBA !!!
    const PUBLIC_KEY = 'YOUR_MERCADO_PAGO_PUBLIC_KEY';
    const ACCESS_TOKEN = 'YOUR_MERCADO_PAGO_ACCESS_TOKEN';

    let mpInstance;

    if (isCartPage && typeof MercadoPago !== 'undefined') {
        mpInstance = new MercadoPago(PUBLIC_KEY, {
            locale: 'es-AR'
        });
    }

    function createMercadoPagoCheckoutButton() {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío. Agrega productos antes de confirmar el pedido.', 'error');
            if (mercadoPagoButtonContainer) {
                mercadoPagoButtonContainer.innerHTML = '';
            }
            return;
        }

        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.innerText = 'Cargando pago...';
        }

        const itemsToPay = cart.map(item => ({
            id: item.id,
            title: item.title + ' - Color: ' + item.color + ' - Talle: ' + item.size + ' - Art: ' + item.article,
            unit_price: item.price,
            quantity: item.quantity,
            currency_id: "ARS",
            picture_url: item.image
        }));

        const preferencesUrl = 'https://api.mercadopago.com/checkout/preferences';

        const preferenceData = {
            items: itemsToPay,
            back_urls: {
                success: window.location.origin + "/pages/pago-exitoso.html",
                pending: window.location.origin + "/pages/pago-pendiente.html",
                failure: window.location.origin + "/pages/pago-fallido.html",
            },
            auto_return: "approved",
            external_reference: 'pedido-' + Date.now(),
            notification_url: "https://your-server.com/webhooks/mercadopago"
        };

        fetch(preferencesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            },
            body: JSON.stringify(preferenceData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
                });
            }
            return response.json();
        })
        .then(preference => {
            if (mercadoPagoButtonContainer) {
                    mercadoPagoButtonContainer.innerHTML = '';

                    if (!mpInstance) {
                    mpInstance = new MercadoPago(PUBLIC_KEY, { locale: 'es-AR' });
                    }
                
                mpInstance.checkout({
                    preference: {
                        id: preference.id
                    },
                    render: {
                        container: '#mercado-pago-button-container',
                        label: 'Pagar con Mercado Pago',
                    }
                });
                console.log('Preferencia de pago creada:', preference);
                mercadoPagoButtonContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showNotification('Proceso de pago iniciado. Haciendo click en "Pagar con Mercado Pago".', 'success');
            if (checkoutButton) {
                checkoutButton.disabled = false;
                checkoutButton.innerText = 'Confirmar Pedido';
                checkoutButton.style.display = 'none';
            }

        })
        .catch(error => {
            console.error('Error al crear la preferencia de pago con Mercado Pago:', error);
            showNotification('No pudimos iniciar el proceso de pago. Por favor, inténtalo de nuevo más tarde.', 'error');
            if (checkoutButton) {
                checkoutButton.disabled = false;
                checkoutButton.innerText = 'Confirmar Pedido';
            }
        });
    }


    // --- INICIALIZACIÓN GENERAL ---
    // Esto asegura que la galería se inicialice solo si los elementos existen (p.ej., en product-detail.html)
    // El elemento productTitleElement existe en esta página (product-detail)
    if (productTitleElement) {
        updateMainImage();
        createThumbnails();
        createDots();
    }

    // Llama a updateCartCount al cargar la página en CUALQUIER página donde main.js esté incluido
    updateCartCount();
});