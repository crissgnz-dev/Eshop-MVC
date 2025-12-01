// public/java/administracion.js

document.addEventListener('DOMContentLoaded', () => {
    // URL de una ruta protegida de administración, por ejemplo, para obtener datos de productos
    // Opcionalmente, puedes crear una ruta simple /api/users/admin/check para solo verificar el token
    const ADMIN_CHECK_URL = 'http://localhost:3000/api/productos'; // Usaremos una ruta de ejemplo que debe estar protegida

    checkAdminAccess(ADMIN_CHECK_URL);
    
    // Aquí iría el resto de la lógica de tu panel de administración (CRUD de productos, etc.)
    
    // Ejemplo de cómo harías una llamada protegida
    // fetchProducts(ADMIN_CHECK_URL);
});

/**
 * Verifica si el usuario tiene un token de administrador válido.
 * Si falla, redirige al login.
 */
async function checkAdminAccess(checkUrl) {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
        // No hay token, acceso denegado inmediatamente
        alert("Acceso denegado. Por favor, inicie sesión como administrador.");
        window.location.href = 'login.html';
        return;
    }
    
    // Si hay token, hacemos una llamada a una ruta protegida
    try {
        const response = await fetch(checkUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 🚨 ENVIAMOS EL TOKEN AL BACKEND PARA SU VERIFICACIÓN DE ROL
                'Authorization': `Bearer ${adminToken}`
            }
        });

        if (response.ok) {
            // Token y rol verificados por el middleware (verify-token.js)
            console.log("Acceso de administrador verificado. Cargando panel...");
            // Continúa la ejecución normal del script (aquí cargarías el contenido del panel)
        } else {
            // El backend devolvió 401 (Token inválido/expirado) o 403 (Rol incorrecto)
            const errorData = await response.json();
            console.error("Fallo la verificación de token:", errorData.message);
            
            // Limpiamos el token viejo y redirigimos
            localStorage.removeItem('adminToken');
            alert(`Acceso denegado: ${errorData.message}`);
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error de conexión al verificar el token:", error);
        alert("Error de conexión con el servidor. Acceso denegado.");
        window.location.href = 'login.html';
    }
}