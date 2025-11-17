document.addEventListener("DOMContentLoaded", () => {
    const contenedorItems = document.querySelector("section.favoritos")

    const mostrarFavoritos = () => {
        let favoritos = recuperarFavoritos()
        contenedorItems.innerHTML = ""

        if (favoritos.length === 0) {
            contenedorItems.innerHTML = "<p>No tienes productos en favoritos.</p>"
            return
        }

        favoritos.forEach(item => {
            const card = document.createElement("div")
            card.className = "card"
            card.innerHTML = `
                <img src="${item.img}" class="card-img-top" alt="${item.title}" />
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.desc}</p>
                    <p class="card-text"><small class="text-body-secondary">${item.price}</small></p>
                    <div class="actions">
                        <button class="btn-carrito">Agregar a carrito</button>
                        <button class="btn-fav">
                            <i class="fa-solid fa-star fa-xl" style="color: #161616;"></i>
                        </button>
                    </div>
                </div>
            `
            contenedorItems.appendChild(card)

            // --- botón carrito ---
            card.querySelector('.btn-carrito').addEventListener('click', () => {
                agregarAlCarrito(item, 1)
            })

            // --- botón eliminar de favoritos ---
            const btnFav = card.querySelector('.btn-fav')
            btnFav.addEventListener('click', () => {
                eliminarDeFavoritos(item.id)
                mostrarFavoritos() // refresca lista
            })
        })
    }

    mostrarFavoritos()
})
