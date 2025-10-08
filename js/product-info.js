document.addEventListener('DOMContentLoaded', () => {
    const id = localStorage.getItem('productoSeleccionado');
    const catID = localStorage.getItem('catID');
    const detailDiv = document.getElementById('product-detail');

    if (!id || !catID || !detailDiv) return;

    // Variable para almacenar comentarios (incluye los nuevos)
    let comentarios = [];

    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
        .then(res => res.json())
        .then(async data => {
            const producto = data.products.find(p => p.id == id);
            if (!producto) {
                detailDiv.innerHTML = `<div class="alert alert-danger">Producto no encontrado.</div>`;
                return;
            }

            // Intentar cargar comentarios del producto desde la API
            try {
                const commentsRes = await fetch(`https://japceibal.github.io/emercado-api/products_comments/${id}.json`);
                if (commentsRes.ok) {
                    const commentsData = await commentsRes.json();
                    comentarios = commentsData || [];
                }
            } catch (error) {
                console.log('Usando comentarios simulados para este producto');
                // Comentarios simulados para mostrar funcionalidad
                comentarios = [
                    {
                        user: "María González",
                        dateTime: "2024-01-15T14:30:00",
                        description: "Excelente producto, muy buena calidad. Lo recomiendo totalmente.",
                        score: 5
                    },
                    {
                        user: "Carlos Rodríguez", 
                        dateTime: "2024-01-10T09:15:00",
                        description: "Buen producto pero llegó con un pequeño defecto. El servicio al cliente lo solucionó rápidamente.",
                        score: 4
                    },
                    {
                        user: "Ana Martínez",
                        dateTime: "2024-01-05T16:45:00", 
                        description: "No cumplió con mis expectativas. La calidad no es la esperada por el precio.",
                        score: 2
                    }
                ];
            }

            // Generar productos relacionados desde la misma categoría
            let productosRelacionados = [];
            try {
                productosRelacionados = data.products
                    .filter(p => p.id != id) // Excluir el producto actual
                    .slice(0, 4) // Tomar máximo 4 productos
                    .map(p => ({
                        id: p.id,
                        name: p.name,
                        image: p.image
                    }));
            } catch (error) {
                console.log('No se pudieron generar productos relacionados');
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
                  <div class="product-price">${producto.currency} ${producto.cost}</div>
                  <div class="flex-responsive">
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
                  </div>
                  </div>
                  <div class="product-description">
                    <strong>DESCRIPCIÓN</strong>
                    <p>${producto.description}</p>
                  </div>
                  <div class="product-bottom-row">
                    <span class="sold-badge">VENDIDOS: ${producto.soldCount}</span>
                    <div class="product-actions">
                      <button class="btn-cart" id="btn-agregar-carrito">
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

                <!-- Sección de Productos Relacionados -->
                ${productosRelacionados.length > 0 ? `
                <div class="related-products-section">
                    <div class="section-title related-title">Productos Relacionados</div>
                    <div class="related-products-grid">
                        ${productosRelacionados.map(related => `
                            <div class="related-product-card" data-product-id="${related.id}" data-cat-id="${catID}">
                                <img src="${related.image}" alt="${related.name}" class="related-product-img">
                                <div class="related-product-info">
                                    <h5>${related.name}</h5>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}

                <!-- Sección de Calificaciones -->
                <div class="ratings-section">
                    <div class="section-title ratings-title">Calificaciones y Comentarios</div>
                    <div class="ratings-content">
                        <div id="comments-container">
                            ${renderComments()}
                        </div>
                    </div>
                </div>

                <!-- Formulario para Nueva Calificación -->
                <div class="rating-form-section">
                    <div class="rating-form-title">Califica este producto</div>
                    <form id="rating-form" class="rating-form">
                        <div class="rating-stars">
                            <label>Calificación:</label>
                            <div class="stars-container">
                                ${[1,2,3,4,5].map(star => `
                                    <span class="star" data-rating="${star}">★</span>
                                `).join('')}
                            </div>
                            <input type="hidden" id="rating-value" value="0">
                        </div>
                        <div class="comment-input">
                            <label for="comment-text">Comentario:</label>
                            <textarea id="comment-text" placeholder="Escribe tu comentario aquí..." rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn-submit-rating">Enviar Calificación</button>
                    </form>
                </div>
                `;
                
                addCarouselEvents();
                addCartButtonEvent();
                addRelatedProductsEvents();
                addRatingFormEvents();
            }

            function renderComments() {
                if (comentarios.length === 0) {
                    return '<p class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
                }
                
                return comentarios.map(comment => `
                    <div class="comment-card">
                        <div class="comment-header">
                            <div class="comment-user">
                                <strong>${comment.user}</strong>
                            </div>
                            <div class="comment-date">
                                ${new Date(comment.dateTime).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                        <div class="comment-rating">
                            ${renderStars(comment.score)}
                        </div>
                        <div class="comment-text">
                            <p>${comment.description}</p>
                        </div>
                    </div>
                `).join('');
            }

            function renderStars(rating) {
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= rating) {
                        stars += '<span class="star filled">★</span>';
                    } else {
                        stars += '<span class="star empty">★</span>';
                    }
                }
                return stars;
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

            function addCartButtonEvent() {
                const btnAgregar = document.getElementById('btn-agregar-carrito');
                if (btnAgregar) {
                    btnAgregar.addEventListener('click', () => {
                        let cart = JSON.parse(localStorage.getItem('carrito')) || [];
                        const productoCarrito = {
                            id: producto.id,
                            name: producto.name,
                            price: producto.cost,
                            description: producto.description,
                            image: producto.image,
                            currency: producto.currency,
                            quantity: 1
                        };
                        const existingProduct = cart.find(item => item.id === productoCarrito.id);
                        if (existingProduct) {
                            existingProduct.quantity += 1;
                        } else {
                            cart.push(productoCarrito);
                        }
                        localStorage.setItem('carrito', JSON.stringify(cart));
                        alert('Producto agregado al carrito');
                    });
                }
            }

            function addRelatedProductsEvents() {
                const relatedProducts = detailDiv.querySelectorAll('.related-product-card');
                relatedProducts.forEach(card => {
                    card.addEventListener('click', () => {
                        const productId = card.getAttribute('data-product-id');
                        const catId = card.getAttribute('data-cat-id');
                        
                        // Actualizar localStorage con el nuevo producto
                        localStorage.setItem('productoSeleccionado', productId);
                        localStorage.setItem('catID', catId);
                        
                        // Recargar la página para mostrar el nuevo producto
                        window.location.reload();
                    });
                });
            }

            function addRatingFormEvents() {
                const stars = detailDiv.querySelectorAll('.rating-stars .star');
                const ratingValue = document.getElementById('rating-value');
                const form = document.getElementById('rating-form');
                
                // Eventos para las estrellas del formulario
                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        const rating = parseInt(star.getAttribute('data-rating'));
                        ratingValue.value = rating;
                        
                        // Actualizar visualmente las estrellas
                        stars.forEach((s, index) => {
                            if (index < rating) {
                                s.classList.add('selected');
                            } else {
                                s.classList.remove('selected');
                            }
                        });
                    });

                    star.addEventListener('mouseover', () => {
                        const rating = parseInt(star.getAttribute('data-rating'));
                        stars.forEach((s, index) => {
                            if (index < rating) {
                                s.classList.add('hover');
                            } else {
                                s.classList.remove('hover');
                            }
                        });
                    });
                });

                // Reset hover effect
                const starsContainer = detailDiv.querySelector('.stars-container');
                starsContainer.addEventListener('mouseleave', () => {
                    stars.forEach(s => s.classList.remove('hover'));
                });

                // Evento del formulario
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const rating = parseInt(ratingValue.value);
                    const commentText = document.getElementById('comment-text').value.trim();
                    
                    if (rating === 0) {
                        alert('Por favor selecciona una calificación');
                        return;
                    }
                    
                    if (commentText === '') {
                        alert('Por favor escribe un comentario');
                        return;
                    }

                    // Crear nuevo comentario usando el email del localStorage
                    const userEmail = localStorage.getItem('email');
                    const newComment = {
                        user: userEmail || 'Usuario Anónimo',
                        dateTime: new Date().toISOString(),
                        description: commentText,
                        score: rating
                    };

                    // Agregar el comentario al inicio de la lista
                    comentarios.unshift(newComment);
                    
                    // Limpiar formulario
                    form.reset();
                    ratingValue.value = 0;
                    stars.forEach(s => {
                        s.classList.remove('selected');
                        s.classList.remove('hover');
                    });
                    
                    // Re-renderizar solo la sección de comentarios
                    const commentsContainer = document.getElementById('comments-container');
                    commentsContainer.innerHTML = renderComments();
                    
                    alert('¡Gracias por tu calificación!');
                });
            }

            renderProductDetail();
        })
        .catch(() => {
            detailDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el producto.</div>`;
        });
});