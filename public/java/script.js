const header = document.querySelector("header")
const footer = document.querySelector("footer")

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
                <li><a href="singin.html">Sign in</a></li>
                <li><a href="login.html">Login</a></li>
                <li><button onclick="toggleCart()">Carrito</button></li>
                <li><a href="favoritos.html"><button>Favoritos</button></a></li>
            </ul>
        </nav>
   
        <div class="opciones">
            <a href="singin.html" class="opcioncitas"><i class="fa-solid fa-arrow-right-to-bracket fa-xl"></i></i> Sign in</a>
            <a href="login.html" class="opcioncitas"><i class="fa-solid fa-user fa-lg"></i></i></i> Login</a>
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

footer.innerHTML = `
        <p>Copyright © 2025 Eshop. All rights reserved.</p>
        `
