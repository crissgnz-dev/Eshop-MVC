// Hacer toggleCart accesible desde HTML
window.toggleCart = () => {
    document.getElementById('cart').classList.toggle('active');
};

document.addEventListener("DOMContentLoaded", () => {

    const mostrarCarrito = () => {
        let carrito = JSON.parse(localStorage.getItem("cart")) || [];

        let contenedorProd = document.querySelector(".cart-items");
        contenedorProd.innerHTML = "";
        let contenedorTotal = document.querySelector(".cart-total");
        contenedorTotal.innerHTML = "";

        if (carrito.length > 0) {
            let total = 0;

            carrito.forEach(item => {
                const card = document.createElement("div");
                card.className = "prodCarrito";
                card.innerHTML = `
                    <img src="${item.img}" alt="">
                    <div class="detalle">
                        <button class="eliminarProd"><i class="fa-solid fa-trash-can"></i></button>
                        <p>${item.title}</p>
                        <div class="agregar">
                            <div class="amount">
                                <button class="restar"><i class="fa-solid fa-square-minus"></i></button>
                                <input type="number" name="cant" min="1" max="${item.stock}" value="${item.amount}">
                                <button class="sumar"><i class="fa-solid fa-square-plus"></i></button>
                            </div>
                            <div>
                                <p class="subtotal">$${item.price.toFixed(2)} c/u</p>
                                <p class="precio">$${(item.amount * item.price).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>`;
                contenedorProd.appendChild(card);

                total += item.amount * item.price;

                card.querySelector(".eliminarProd").onclick = () => {
                    eliminarProducto(item.id);
                    mostrarCarrito();
                };

                card.querySelector(".sumar").onclick = () => {
                    if (item.amount < item.stock) {
                        item.amount++;
                        modificarCantidad(item.amount, item.stock, item.id);
                        mostrarCarrito();
                    }
                };

                card.querySelector(".restar").onclick = () => {
                    if (item.amount > 1) {
                        item.amount--;
                        modificarCantidad(item.amount, item.stock, item.id);
                        mostrarCarrito();
                    }
                };

                card.querySelector('[name="cant"]').onchange = () => {
                    const cant = parseInt(card.querySelector('[name="cant"]').value);
                    modificarCantidad(cant, item.stock, item.id);
                    mostrarCarrito();
                };
            });

            contenedorTotal.innerHTML = `
                <div class="total">
                    <p>TOTAL</p>
                    <p class="precio">$${total.toFixed(2)}</p>
                </div>
                <button class="comprar" id="finalizarCompra">Comprar Ahora</button>
                <button class="vaciar" id="vaciar">Vaciar Carrito</button>`;

            document.querySelector("#vaciar").onclick = () => {
                vaciarCarrito();
                mostrarCarrito();
            };

            document.querySelector("#finalizarCompra").onclick = () => {
                finalizarCompra();
            };
        } else {
            contenedorProd.innerHTML = "<p>Carrito vacío</p>";
        }
    };

    mostrarCarrito();
    window.mostrarCarrito = mostrarCarrito; // también global para otros scripts
});
