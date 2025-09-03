let products = [];

const catID = localStorage.getItem("catID");

fetch('https://japceibal.github.io/emercado-api/cats_products/' + catID + '.json')
  .then(respuesta => respuesta.json())
  .then(data => {
    products = data.products.map(auto => ({
      name: auto.name,
      price: auto.cost,
      sold: auto.soldCount,
      description: auto.description,
      image: auto.image,
      currency: auto.currency,
      category: data.catName 
    }));

    mostrarProductos(products); 
  })
  .catch(error => console.error('Error al cargar autos:', error));


function mostrarProductos(lista) {
  const contenedor = document.querySelector('.contenedor');
  contenedor.innerHTML = '';
  for (let i = 0; i < lista.length; i++) {
    const auto = lista[i];
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="img">
        <img src="${auto.image}" alt="${auto.name}" style="max-width:100%;height:auto;">
      </div>
      <div class="description">
        <h5>${auto.name}</h5>
        <p>${auto.description}</p>
      </div>
      <div class="price-count">
        <div>
          <span class="badge rounded-pill bg-success">Precio: ${auto.price} ${auto.currency}</span>
        </div>
        <div>
          <span class="badge rounded-pill bg-info">Vendidos: ${auto.sold}</span>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  }
}

    


