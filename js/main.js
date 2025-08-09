// main.js limpio con estructura clara y ordenada

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // === CONFIGURACIÓN INICIAL ===
  let productData = {};
  const productDataElement = document.getElementById('product-data');
  if (productDataElement) {
    try {
      productData = JSON.parse(productDataElement.dataset.images);
    } catch (e) {
      console.error('No se pudo cargar las imágenes del producto:', e);
    }
  }

  const availableColors = Object.keys(productData);
  let selectedColor = availableColors[0] || 'default';
  let currentImages = productData[selectedColor] || [];
  let currentImageIndex = 0;

  if (availableColors.length <= 1) {
    document.querySelector('.color-option')?.classList.add('hidden');
  }

  // === ELEMENTOS DEL DOM ===
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
  const productTitleElement = document.querySelector('.product-title');
  const productPriceElement = document.querySelector('.product-price');
  const productArticleElement = document.querySelector('.product-article');
  const cartItemCountSpan = document.getElementById('cart-item-count');

  // === FUNCIONES DE GALERÍA ===
  function updateMainImage() {
    if (!mainProductImage) return;
    mainProductImage.src = currentImages[currentImageIndex];
    updateThumbnails();
    updateDots();
  }

  function createThumbnails() {
    if (!thumbnailContainer) return;
    thumbnailContainer.innerHTML = '';
    currentImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'thumbnail-item';
      if (i === currentImageIndex) img.classList.add('active');
      img.addEventListener('click', () => {
        currentImageIndex = i;
        updateMainImage();
      });
      thumbnailContainer.appendChild(img);
    });
  }

  function updateThumbnails() {
    document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentImageIndex);
    });
  }

  function createDots() {
    if (!galleryDotsContainer) return;
    galleryDotsContainer.innerHTML = '';
    currentImages.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === currentImageIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentImageIndex = i;
        updateMainImage();
      });
      galleryDotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentImageIndex);
    });
  }

  
  

  // === EVENTOS DE NAVEGACIÓN ===
  prevArrow?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateMainImage();
  });

  nextArrow?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateMainImage();
  });

  // === CAMBIO DE COLOR ===
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedColor = swatch.dataset.color;
      currentImages = productData[selectedColor] || [];
      currentImageIndex = 0;
      updateMainImage();
      createThumbnails();
      createDots();
    });
  });

  // === CAMBIO DE TALLE ===
  let selectedSize = '';
  sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
      sizeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedSize = button.dataset.size;
    });
  });

  // === CANTIDAD ===
  decrementQuantityBtn?.addEventListener('click', () => {
    const val = parseInt(quantityInput.value);
    if (val > 1) quantityInput.value = val - 1;
  });

  incrementQuantityBtn?.addEventListener('click', () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });

  // === AGREGAR AL CARRITO ===
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  addToCartButton?.addEventListener('click', () => {
    const title = productTitleElement?.innerText || 'Producto';
    const price = parseFloat(productPriceElement?.innerText.replace('$', '').replace('.', '').replace(',', '.') || 0);
    const article = productArticleElement?.innerText.replace('Artículo: ', '') || 'N/A';

    if (!selectedSize) {
      alert('Seleccioná un talle.');
      return;
    }

    const id = `prod-${title.replace(/\s+/g, '-').toLowerCase()}-${selectedColor}-${selectedSize}`;
    const existing = cart.find(item => item.id === id);

    if (existing) {
      existing.quantity += parseInt(quantityInput.value);
    } else {
      cart.push({
        id,
        title,
        price,
        quantity: parseInt(quantityInput.value),
        color: selectedColor,
        size: selectedSize,
        image: mainProductImage?.src || '',
        article
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    cartConfirmationMessage?.classList.remove('hidden');
    setTimeout(() => cartConfirmationMessage?.classList.add('hidden'), 5000);
    updateCartCount();
  });

  // === CONTADOR EN HEADER ===
  function updateCartCount() {
    if (!cartItemCountSpan) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCountSpan.innerText = totalItems;
    cartItemCountSpan.classList.toggle('hidden', totalItems === 0);
  }

  // === INICIO ===
  if (mainProductImage) {
    updateMainImage();
    createThumbnails();
    createDots();
  }

  updateCartCount();
});

document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".product-thumbnails img");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");

  // Verificamos si hay una galería sin colores
  if (mainImage && thumbnails.length > 0 && prevButton && nextButton) {
    let currentIndex = 0;

    function updateImage(index) {
      mainImage.src = thumbnails[index].src;
      mainImage.alt = thumbnails[index].alt;
    }

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      updateImage(currentIndex);
    });

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      updateImage(currentIndex);
    });
  }

  // Código para versión con selector de color (si existe esa estructura en la página)
  const productData = document.getElementById("product-data");
  if (productData) {
    const imagesByColor = JSON.parse(productData.dataset.images);
    const colorSwatches = document.querySelectorAll(".color-swatch");

    colorSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const selectedColor = swatch.dataset.color;
        if (imagesByColor[selectedColor]) {
          mainImage.src = imagesByColor[selectedColor][0];
        }
      });
    });
  }
});

// --- Lógica para el Acordeón de Preguntas Frecuentes ---
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.question');
    question.addEventListener('click', () => {
        // Cierra todas las otras preguntas
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        // Alterna la clase 'active' para el item clickeado
        item.classList.toggle('active');
    });
});

/*pagina de contacto*/
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    // !!! IMPORTANTE: REEMPLAZA ESTE NÚMERO CON TU NÚMERO DE WHATSAPP REAL (código de país + número, sin +, espacios o guiones) !!!
    const whatsappNumber = 'TUNUMERODETELEFONO'; // Ejemplo para Argentina: '5492611234567'

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormMessage('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }

            // Construye el mensaje de WhatsApp
            let whatsappMessage = `¡Hola Entre Encajes!\n\n`;
            whatsappMessage += `Recibimos un mensaje desde el formulario de contacto de la web.\n\n`;
            whatsappMessage += `Nombre: ${name}\n`;
            whatsappMessage += `Email: ${email}\n`;
            if (phone) { // Incluye el teléfono solo si fue proporcionado
                whatsappMessage += `Teléfono: ${phone}\n`;
            }
            whatsappMessage += `Asunto: ${subject}\n`;
            whatsappMessage += `Mensaje: \n${message}`;

            // Codifica el mensaje para la URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Crea la URL de WhatsApp
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Redirige al usuario a WhatsApp
            window.open(whatsappURL, '_blank'); // Abre en una nueva pestaña

            // Muestra un mensaje de éxito en la web
            showFormMessage('¡Mensaje enviado con éxito! Te hemos redirigido a WhatsApp.', 'success');

            // Opcional: Limpiar el formulario después de enviar
            contactForm.reset();
        });
    }

    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.innerText = message;
            formMessage.className = `form-message ${type}`; // Añadir clase 'success' o 'error'
            formMessage.classList.remove('hidden');

            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000); // Ocultar después de 5 segundos
        }
    }
});
