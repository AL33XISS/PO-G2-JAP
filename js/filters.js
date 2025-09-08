
// Esta función se encarga de filtrar
//  y ordenar los productos según los valores que el usuario ingrese en los campos de precio y el selector de ordenamiento.
function applyFilters() {
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
  const sortOption = document.getElementById('sortOption').value;

  //Filtrar productos por precio
  let filtered = [];
  for (let i = 0; i < products.length; i++) {
    if (
      Number(products[i].price) >= minPrice &&
      Number(products[i].price) <= maxPrice
    ) {
      filtered.push(products[i]);
    }
  }
// Ordenar los productos filtrados
  if (sortOption === 'priceAsc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOption === 'priceDesc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortOption === 'soldDesc') {
    filtered.sort((a, b) => Number(b.sold) - Number(a.sold));
  }

// Mostrar los productos filtrados
  mostrarProductos(filtered);
}

//Evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('applyBtn').addEventListener('click', applyFilters);
});


