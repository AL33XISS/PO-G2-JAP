fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
    .then(respuesta => respuesta.json())
    .then(autos => {
        const contenedor = document.querySelector('.contenedor');


        autos.products.forEach(auto => {
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
                        <span class="badge rounded-pill bg-success">Precio: ${auto.cost} ${auto.currency}</span>
                    </div>
                    <div>
                        <span class="badge rounded-pill bg-info">Vendidos: ${auto.soldCount}</span>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error al cargar autos:', error);
    });


