
// Redirigir al login si el usuario no esta logueado
if (!localStorage.getItem("email")) {
    window.location.href = "login.html";
    throw new Error("Redirigiendo al login");
}

const email = localStorage.getItem("email");
const usuarioEmail = document.getElementById("usuario-email");
const menuOpciones = document.getElementById("menu-opciones");
const cerrarSesion = document.getElementById("cerrar-sesion");
const searchInput = document.getElementById("searchInput");
const productsContainer = document.getElementById("productsContainer");

if (email) {
    usuarioEmail.textContent = email;

    usuarioEmail.addEventListener("click", () => {
        menuOpciones.style.display =
            menuOpciones.style.display === "block" ? "none" : "block";
    });

    cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("email");
        window.location.reload();
    });
    window.addEventListener("click", (e) => {
        if (!e.target.matches("#usuario-email")) {
            menuOpciones.style.display = "none";
        }
    });
} else {
    usuarioEmail.textContent = "Iniciar sesión";
    usuarioEmail.onclick = () => {
        window.location.href = "login.html";
    };
    menuOpciones.style.display = "none";
}


// Cargar todos los productos

let allProducts = [];

const categoryIDs = [101, 102, 103, 104];

async function cargarTodosLosProductos() {
    allProducts = [];
    for (const catID of categoryIDs) {
        const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            const productosCat = data.products.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.cost,
                currency: p.currency,
                image: p.image,
                category: data.catName,
                catID: catID
            }));
            allProducts = allProducts.concat(productosCat);
        } catch (e) {
            console.error("Error cargando productos de categoría", catID, e);
        }
    }
}

cargarTodosLosProductos();

// BARRA DE BUSQUEDA

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    if (!query) {
        resultsContainer.style.display = "none";
        resultsContainer.innerHTML = "";
        return;
    }
    // Filtra por nombre y descripción
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    if (filtered.length === 0) {
        resultsContainer.innerHTML = "<div>No se encontraron productos.</div>";
    } else {
        resultsContainer.innerHTML = filtered.map(p => `
            <div class="search-result-item" 
                 data-id="${p.id}" 
                 data-cat="${p.catID}" 
                 style="cursor:pointer;">
                <img src="${p.image}" class="search-result-img" alt="${p.name}">
                <div>
                    <div class="search-result-name">${p.name}</div>
                    <div class="search-result-desc">${p.description}</div>
                    <div class="search-result-price">${p.price} ${p.currency}</div>
                </div>
            </div>
        `).join("");
    }
    resultsContainer.style.display = "block";

    // Link de cada resultado a su respectivo producto
    resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            const catID = item.getAttribute('data-cat');
            localStorage.setItem('productoSeleccionado', id);
            localStorage.setItem('catID', catID);
            window.location.href = 'product-info.html';
        });
    });
});

document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchInput") && !e.target.closest("#searchResults")) {
        document.getElementById("searchResults").style.display = "none";
    }
});

/* =============================================
=          MODO CLARO/OSCURO MEJORADO        =
============================================== */

// dark-mode.js - Sistema de modo oscuro con transiciones suaves

// Crear el botón de modo oscuro
function createThemeToggleButton() {
  const button = document.createElement('button');
  button.className = 'theme-toggle-btn';
  button.setAttribute('aria-label', 'Cambiar tema');
  button.innerHTML = '🌙'; // Luna por defecto (modo claro)
  document.body.appendChild(button);
  return button;
}

// Obtener el tema guardado o usar 'light' por defecto
function getSavedTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Guardar el tema en localStorage
function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}

// Aplicar el tema
function applyTheme(theme) {
  const html = document.documentElement;
  const button = document.querySelector('.theme-toggle-btn');
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    if (button) button.innerHTML = '☀️'; // Sol para modo oscuro
  } else {
    html.setAttribute('data-theme', 'light');
    if (button) button.innerHTML = '🌙'; // Luna para modo claro
  }
  
  saveTheme(theme);
}

// Alternar entre temas
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Agregar una clase temporal para animación extra si lo deseas
  document.body.classList.add('theme-transitioning');
  
  applyTheme(newTheme);
  
  // Remover la clase después de la transición
  setTimeout(() => {
    document.body.classList.remove('theme-transitioning');
  }, 400);
}

// Inicializar el modo oscuro
function initDarkMode() {
  // Crear el botón
  const button = createThemeToggleButton();
  
  // Aplicar el tema guardado inmediatamente (antes de que se vea la página)
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
  
  // Agregar event listener al botón
  button.addEventListener('click', toggleTheme);
  
  // Detectar preferencia del sistema (opcional)
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Solo aplicar preferencia del sistema si no hay tema guardado
  if (!localStorage.getItem('theme')) {
    applyTheme(prefersDark.matches ? 'dark' : 'light');
  }
  
  // Escuchar cambios en la preferencia del sistema
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}

// También puedes exponer funciones globalmente si las necesitas
window.darkMode = {
  toggle: toggleTheme,
  setTheme: applyTheme,
  getTheme: () => getSavedTheme()
};



// =========================
//   SISTEMA DE CARRITO
// =========================

// Obtiene el total actual de productos en el carrito
function getCartCount() {
  const cart = JSON.parse(localStorage.getItem('carrito')) || [];
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Actualiza el badge del carrito en la navbar     
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    // Ocultar badge si no hay productos
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Actualiza el badge al cargar cada página
document.addEventListener("DOMContentLoaded", updateCartBadge);

// Escuchar cambios en localStorage desde otras pestañas/ventanas
window.addEventListener('storage', (e) => {
  if (e.key === 'carrito') {
    updateCartBadge();
  }
});


