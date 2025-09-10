
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
