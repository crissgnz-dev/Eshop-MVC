// public/java/script.js

    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const LOGIN_API_URL = 'http://localhost:3000/users/login/admin'; 
    const LOGOUT_API_URL = 'http://localhost:3000/users/logout'; // Endpoint de logout que limpia la cookie
    const VERIFY_ADMIN_URL = 'http://localhost:3000/users/verify-admin-session';

    document.addEventListener('DOMContentLoaded', () => {
        // 1. Lógica para manejar el formulario de Login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // En login.html, adjuntamos la lógica de submit
            loginForm.addEventListener('submit', handleLoginFormSubmit);
        }
        
        // 2. Lógica para cargar el Header/Footer
        loadHeader();
    });


    // 🔑 Función de Lógica de Login para el formulario
    async function handleLoginFormSubmit(e) {
        e.preventDefault();
        
        // ⬇️ Capturamos los valores
        const emailValue = document.getElementById('email').value;
        const passwordValue = document.getElementById('password').value;
        
        const userData = { email: emailValue, password: passwordValue };
        
        try {
            const response = await fetch(LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // CRUCIAL: Necesario para enviar y recibir cookies desde el servidor
                credentials: 'include', 
                body: JSON.stringify(userData),
            });
            
            if (response.ok) {
                // El token de administrador ahora se establece como una Cookie HTTP-Only por el servidor.
                // NO se guarda nada en localStorage. Solo redirigimos.
                
                console.log("Inicio de sesión de administrador exitoso. Cookie establecida. Redirigiendo...");
                
                // 2. REDIRECCIÓN CRUCIAL AL PANEL DE ADMINISTRACIÓN
                // Importante: usamos la ruta /administracion.html que está protegida en index.js
                window.location.href = 'http://localhost:3000/administracion.html'; 
                
            } else {
                // Manejo de errores 401, 403, 422, etc.
                let errorMessage = 'Error de inicio de sesión. Verifique sus credenciales.';
                const contentType = response.headers.get("content-type");
                
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json().catch(() => ({ message: errorMessage }));
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } else {
                    errorMessage = `Error ${response.status}: Respuesta no JSON.`;
                }

                console.error("Fallo el login:", errorMessage);
                alertPlaceholder(errorMessage, 'danger');
            }
        } catch (error) {
            console.error("Error de conexión con el servidor:", error);
            alertPlaceholder('No se pudo conectar con el servidor. Intente de nuevo más tarde.', 'danger');
        }
    }

    // Función de reemplazo simple para alert()
    function alertPlaceholder(message, type) {
        // Lógica para mostrar mensajes de error visibles en la UI (en la consola o cerca del formulario)
        console.warn(`[UI Message - ${type.toUpperCase()}]: ${message}`);
        
        const submitBtn = document.querySelector('#loginForm .submit-btn');
        if (submitBtn) {
            // Guardamos el texto original para poder restaurarlo después del error.
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Error!';
            submitBtn.style.backgroundColor = '#dc3545'; // Color de peligro
            
            const errorDiv = document.getElementById('login-error-message');
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = ''; // Revertir color
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                    errorDiv.textContent = '';
                }
            }, 4000);
        }
    }


    // 🔑 Función para cargar el encabezado según el estado de la sesión
    async function loadHeader() {
        let isAdminLoggedIn = false;
        
        // Verificación de sesión: Llamar a una ruta protegida para ver si el usuario tiene una cookie válida
        try {
            const checkResponse = await fetch(VERIFY_ADMIN_URL, {
                method: 'GET',
                credentials: 'include' // Necesario para enviar la cookie 'access_token'
            });
            
            // Si la respuesta es 202 (Aceptado), la cookie es válida y verifyT pasó.
            if (checkResponse.status === 202) {
                const result = await checkResponse.json();
                if (result.role === 'admin') { 
                    isAdminLoggedIn = true;
                }
            }
        } catch (error) {
            console.warn("Fallo la verificación de sesión de administrador:", error);
            isAdminLoggedIn = false;
        }
        
        let userLinks;
        let opcionesLinks;

        if (isAdminLoggedIn) {
            // 🛡️ Si es administrador: Mostrar enlace de Admin y Cerrar Sesión
            userLinks = `
                <li><a href="http://localhost:3000/administracion.html">Administración</a></li> 
                <li><button onclick="logout()">Cerrar Sesión</button></li>
            `;
            
            opcionesLinks = `
                <a href="http://localhost:3000/administracion.html" class="opcioncitas"><i class="fa-solid fa-screwdriver-wrench fa-xl"></i> Admin</a>
                <button class="opcioncitas" onclick="logout()"><i class="fa-solid fa-right-from-bracket fa-lg"></i> Logout</button>
            `;
            
        } else {
            // 👤 Si NO es administrador (o no tiene sesión): Mostrar Sign in y Login
            userLinks = `
                <li><a href="singin.html">Sign in</a></li>
                <li><a href="login.html">Login</a></li>
            `;
            
            opcionesLinks = `
                <a href="singin.html" class="opcioncitas"><i class="fa-solid fa-arrow-right-to-bracket fa-xl"></i> Sign in</a>
                <a href="login.html" class="opcioncitas"><i class="fa-solid fa-user fa-lg"></i> Login</a>
            `;
        }

        if (header) {
            header.innerHTML = `
                <div>
                    <div class="logo">
                        <img src="img/logo.png" alt="Logo" />
                    </div>
                    <h1>Eshop</h1>
                </div>
                
                <input type="checkbox" id="menu" />
                <label for="menu" class="menu-icon">
                    <span><img src="img/menu.png"></span>
                </label>
                <nav class="menu">
                    <ul>
                        ${userLinks} 
                        <li><button onclick="toggleCart()">Carrito</button></li>
                        <li><a href="favoritos.html"><button>Favoritos</button></a></li>
                    </ul>
                </nav>
                
                <div class="opciones">
                    ${opcionesLinks} 
                    <button id="abrir" class="opcioncitas" onclick="toggleCart()"><i class="fa-solid fa-cart-shopping fa-lg"></i> Carrito</button>
                    <button class="opcioncitas"><a href="favoritos.html" style="color: white;"><i class="fa-solid fa-star fa-lg"></i> Favoritos</a></button>
                </div>

                <div id="cart" class="cart-sidebar">
                    <div class="cart-header">
                    <h2>Tu Carrito</h2>
                    <button class="close-btn" onclick="toggleCart()">×</button>
                    </div>
                    <div class="cart-items">
                    </div>
                    
                    <div class="cart-total">
                    
                    </div>
                    
                    <div class="seguirencompra">
                    <a href="index.html">Seguir comprando</a>
                    </div>
                </div>
                `; 
        }

        if (footer) {
            footer.innerHTML = `
                <p>Copyright © 2025 Eshop. All rights reserved.</p>
                `;
        }
    }

    // 🔑 Función para cerrar sesión (logout)
    async function logout() {
        // LLamamos al endpoint de logout que elimina la cookie en el servidor
        try {
            const response = await fetch(LOGOUT_API_URL, {
                method: 'POST', // Usar POST o GET, dependiendo de cómo esté configurado el endpoint
                credentials: 'include'
            });
            
            if (response.ok) {
                console.log("Sesión cerrada correctamente.");
            } else {
                console.error("Fallo al cerrar sesión en el servidor.");
            }
        } catch (error) {
            console.error("Error de conexión al intentar cerrar sesión:", error);
        }
        
        // Recarga la página para mostrar el header sin el enlace de Admin
        window.location.href = 'index.html'; 
    }

    // 🛒 Función MOCK para el carrito (faltaba en el código)
    function toggleCart() {
        const cart = document.getElementById('cart');
        if (cart) {
            cart.classList.toggle('open'); // Asume que tienes una clase 'open' en tu CSS
            console.log("Toggle Carrito. Si no funciona, verifica la clase 'open' en el CSS.");
        }
    }