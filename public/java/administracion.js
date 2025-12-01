// public/java/administracion.js
// Lógica principal del panel de administración
// ESTE ARCHIVO YA NO USA localStorage.getItem('adminToken')
// Confía en que la cookie 'access_token' será enviada automáticamente
// gracias a 'credentials: include' o por ser el mismo dominio.

document.addEventListener('DOMContentLoaded', () => {
    // URL que verifica el token en la cookie y el rol 'admin'
    const ADMIN_CHECK_URL = 'http://localhost:3000/users/verify-admin-session'; 

    checkAdminAccess(ADMIN_CHECK_URL);
    
    // Aquí iría el resto de la lógica del panel (CRUD de productos, etc.)
});

/**
 * Verifica si el usuario tiene una sesión de administrador válida (a través de la cookie).
 * Si falla, redirige al login.
 */
async function checkAdminAccess(checkUrl) {
    console.log("Verificando acceso de administrador mediante Cookie HTTP-Only...");
    
    // 🚨 Importante: El token NO se lee de localStorage.
    
    try {
        const response = await fetch(checkUrl, {
            method: 'GET',
            // 🔑 CRUCIAL: Esto garantiza que la Cookie 'access_token' sea enviada.
            credentials: 'include',
        });

        if (response.status === 202) {
            // El servidor respondió 202 (Accepted) -> Cookie válida y Rol de Admin verificado.
            const userData = await response.json();
            console.log("✅ Acceso de administrador verificado. Bienvenido:", userData.user.email);
            // La UI puede cargarse aquí con seguridad.
        } else {
            // El servidor devolvió 401 (Unauthorized) o 403 (Forbidden)
            
            let errorMessage = "Acceso denegado. Por favor, vuelva a iniciar sesión.";
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error(`❌ Fallo la verificación de sesión (${response.status}):`, errorMessage);
            } catch (e) {
                errorMessage = `Error del servidor: ${response.status}. Redirigiendo a login.`;
                console.error(`❌ Fallo la verificación de sesión (${response.status}). Respuesta no JSON.`);
            }
            
            // Limpiamos el token viejo (por si acaso había uno)
            localStorage.removeItem('adminToken');
            
            // Redirigimos al login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
        }
    } catch (error) {
        // Esto captura errores de red
        console.error("❌ Error de conexión al verificar la sesión. El servidor podría estar caído.", error);
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 100);
    }
}