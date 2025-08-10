document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".add-to-cart");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            const id = boton.dataset.id;
            const name = boton.dataset.name;
            const price = parseFloat(boton.dataset.price);
            const image = boton.dataset.image;

            // Talle y color
            const size = boton.parentElement.querySelector(".product-size")?.value || "";
            const color = boton.parentElement.querySelector(".product-color")?.value || "";

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Verificar si el producto ya existe con mismo talle y color
            const existingProduct = cart.find(item => item.id === id && item.size === size && item.color === color);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    size,
                    color,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Producto agregado al carrito ✅");
        });
    });
});
