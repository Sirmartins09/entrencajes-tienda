document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const totalContainer = document.getElementById('total-container');

    function renderCart() {
        cartContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>🛒 Tu carrito está vacío.</p>';
            totalContainer.textContent = '';
            return;
        }

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <img src="${item.image}" alt="${item.title}" width="80">
                <div>
                    <h4>${item.title}</h4>
                    <p>Talle: ${item.size} | Color: ${item.color}</p>
                    <p>Precio: $${item.price.toFixed(2)}</p>
                    <p>
                        Cantidad: 
                        <button class="decrease" data-index="${index}">-</button>
                        ${item.quantity}
                        <button class="increase" data-index="${index}">+</button>
                    </p>
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <button class="remove" data-index="${index}">❌ Eliminar</button>
                </div>
            `;
            cartContainer.appendChild(div);
        });

        totalContainer.textContent = `Total: $${total.toFixed(2)}`;

        // 📌 Eventos para botones
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', () => {
                cart[btn.dataset.index].quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', () => {
                if (cart[btn.dataset.index].quantity > 1) {
                    cart[btn.dataset.index].quantity--;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', () => {
                cart.splice(btn.dataset.index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    renderCart();
});
