document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('productoSeleccionado');
    const catID = localStorage.getItem('catID');
    const detailDiv = document.getElementById('product-detail');

    if (!id || !catID || !detailDiv) return;

    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
        .then(res => res.json())
        .then(async data => {
            const producto = data.products.find(p => p.id == id);
            if (!producto) {
                detailDiv.innerHTML = `<div class="alert alert-danger">Producto no encontrado.</div>`;
                return;
            }

            // Generar nombres de imágenes asociadas (hasta 5 imágenes)
            function generarImagenes(baseImg) {
                const imgs = [];
                const match = baseImg.match(/(.*?)(\d+)(\.\w+)$/);
                if (match) {
                    const [_, base, num, ext] = match;
                    for (let i = 1; i <= 5; i++) {
                        imgs.push(`${base}${i}${ext}`);
                    }
                } else {
                    imgs.push(baseImg);
                }
                return imgs;
            }

            // Verifica si la imagen existe (opcional, para evitar imágenes rotas)
            async function filtrarImagenesExistentes(imgs) {
                const checks = await Promise.all(imgs.map(src =>
                    fetch(src, { method: 'HEAD' }).then(r => r.ok ? src : null).catch(() => null)
                ));
                return checks.filter(Boolean);
            }

            let images = generarImagenes(producto.image);
            images = await filtrarImagenesExistentes(images);
            if (images.length === 0) images = [producto.image];

            let currentIndex = 0;

            function renderProductDetail() {
                detailDiv.innerHTML = `
               <div class="product-info-card">
                  <h1 class="product-title">${producto.name}</h1>
                  <div class="product-category">${data.catName}</div>
                  <DIV class="flex-responsive">
                  <div class="product-main-img" style="position:relative;">
                    <button class="carousel-arrow left-arrow" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.3);border:none;color:#fff;font-size:2rem;border-radius:50%;width:40px;height:40px;z-index:2;">&#8592;</button>
                    <img id="main-product-img" src="${images[currentIndex]}" alt="${producto.name}">
                    <button class="carousel-arrow right-arrow" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.3);border:none;color:#fff;font-size:2rem;border-radius:50%;width:40px;height:40px;z-index:2;">&#8594;</button>
                  </div>
                  <div class="product-associated-imgs">
                    ${images.map((img, idx) => `
                      <div class="associated-img-card${idx === currentIndex ? ' selected' : ''}" data-idx="${idx}">
                        <img src="${img}" alt="Imagen asociada">
                      </div>
                    `).join('')}
                  </DIV>
                  </div>
                  <div class="product-description">
                    <strong>DESCRIPCIÓN</strong>
                    <p>${producto.description}</p>
                  </div>
                  <div class="product-bottom-row">
                    <span class="sold-badge">VENDIDOS: ${producto.soldCount}</span>
                    <div class="product-actions">
                      <button class="btn-cart">
                        <lord-icon
                            src="https://cdn.lordicon.com/uisoczqi.json"
                            trigger="hover"
                            colors="primary:#ffffff,secondary:#ffffff"
                            stroke="bold"
                            style="width:30px;height:30px">
                        </lord-icon>                    
                      </button>

                      <button class="btn-buy">COMPRAR</button>
                    </div>
                  </div>
                </div>
                `;
                addCarouselEvents();
            }

            function addCarouselEvents() {
                const leftArrow = detailDiv.querySelector('.left-arrow');
                const rightArrow = detailDiv.querySelector('.right-arrow');
                const thumbs = detailDiv.querySelectorAll('.associated-img-card');

                leftArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    renderProductDetail();
                });
                rightArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    renderProductDetail();
                });
                thumbs.forEach(thumb => {
                    thumb.addEventListener('click', () => {
                        currentIndex = parseInt(thumb.getAttribute('data-idx'));
                        renderProductDetail();
                    });
                });
            }

            renderProductDetail();
        })
        .catch(() => {
            detailDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el producto.</div>`;
        });
});