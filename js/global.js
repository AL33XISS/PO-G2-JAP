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

// Lista de IDs de categorías (puedes obtenerla de la API o definirla manualmente)
const categoryIDs = [101, 102, 103, 104]; // Ejemplo: autos, juguetes, muebles, etc.

async function cargarTodosLosProductos() {
    allProducts = [];
    for (const catID of categoryIDs) {
        const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            const productosCat = data.products.map(p => ({
                name: p.name,
                description: p.description,
                price: p.cost,
                currency: p.currency,
                image: p.image,
                category: data.catName
            }));
            allProducts = allProducts.concat(productosCat);
        } catch (e) {
            console.error("Error cargando productos de categoría", catID, e);
        }
    }
}

// Llama a la función al cargar la página
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
            <div class="search-result-item">
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
});

// Opcional: Ocultar el recuadro si se hace click fuera
document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchInput") && !e.target.closest("#searchResults")) {
        document.getElementById("searchResults").style.display = "none";
    }
});
