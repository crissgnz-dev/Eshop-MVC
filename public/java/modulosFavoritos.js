// Recuperar favoritos del localStorage o iniciar como array vacío
const recuperarFavoritos = () => {
    return JSON.parse(localStorage.getItem("favoritos")) || []
}

// Guardar favoritos en localStorage
const guardarFavoritos = (favoritos) => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos))
}

// Agregar nuevo item a favoritos
const agregarAFavoritos = (item) => {
    let favoritos = recuperarFavoritos()
    // Evitar duplicados
    if (!favoritos.some(fav => fav.id === item.id)) {
        favoritos.push(item)
        guardarFavoritos(favoritos)
    }
}

// Eliminar de favoritos
const eliminarDeFavoritos = (id) => {
    let favoritos = recuperarFavoritos().filter(i => i.id !== id)
    if (favoritos.length === 0) {
        localStorage.removeItem("favoritos")
    } else {
        guardarFavoritos(favoritos)
    }
}

// Saber si un producto está en favoritos
const esFavorito = (id) => {
    return recuperarFavoritos().some(i => i.id === id)
}
