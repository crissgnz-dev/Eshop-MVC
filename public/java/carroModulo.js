const mostrarMensaje = (msg) => {
    alert(msg);
}

const recuperarCarrito = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

const agregarAlCarrito = (item, cant) => {
    let carrito = recuperarCarrito();
    const prodEncontrado = carrito.find(p => p.id == item.id);
    if (!prodEncontrado) {
        if (cant > item.stock) {
            mostrarMensaje(`Cant insuficiente, en stock solo ${parseInt(item.stock)}`);
        } else {
            item.amount = cant;
            carrito.push(item);
            localStorage.setItem("cart", JSON.stringify(carrito));
            mostrarMensaje(`${item.title} ha sido agregado al carrito`);
        }
    } else {
        mostrarMensaje('El producto ya se encuentra en el carrito');
    }
    mostrarCarrito(); // refresca el sidebar después de agregar
}

const eliminarProducto = (id_eliminar) => {
    let carrito = recuperarCarrito();
    carrito = carrito.filter(item => item.id != id_eliminar);
    if (carrito.length == 0) {
        localStorage.removeItem("cart");
    } else {
        localStorage.setItem("cart", JSON.stringify(carrito));
    }
}

const modificarCantidad = (cant, stock, id) => {
    let carrito = recuperarCarrito();
    if (cant > stock) {
        mostrarMensaje(`Cant insuficiente, en stock ${stock}`);
    } else if (cant < 1) {
        mostrarMensaje(`Cantidad mínima 1`);
    } else {
        const prodIndice = carrito.findIndex(p => p.id == id);
        carrito[prodIndice] = {
            ...carrito[prodIndice],
            amount: cant
        };
        localStorage.setItem("cart", JSON.stringify(carrito));
    }
}

const vaciarCarrito = () => {
    localStorage.removeItem("cart");
}

const finalizarCompra = () => {
    localStorage.removeItem("cart");
    mostrarMensaje("Compra finalizada exitosamente");
    mostrarCarrito();
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
}