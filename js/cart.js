let cart = JSON.parse(localStorage.getItem('carrito')) || [];

function saveCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
}

function updateCart() {
    const cartContainer = document.getElementById('lista-carrito');
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="font-size: 1.3vw; color: gray">El carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image || 'img/placeholder.png'}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-desc">${item.description || ''}</span>
                    <span>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                        <span class="cart-item-currency">${item.currency || ''}</span>
                    </span>
                </div>
                <div class="cart-item-controls">
                    <input type="number" value="${item.quantity}" min="1"
                        onchange="updateQuantity(${item.id}, this.value)">
                    <button onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });
    }
    updateTotal();
    saveCart();
    
    // Actualizar el badge
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

window.updateQuantity = function(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
};

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateTotal() {
    const totalElement = document.getElementById('total-carrito');
    totalElement.innerText = `Total: $${calculateTotal().toFixed(2)}`;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    alert('Procediendo al pago...');
}

document.getElementById('btn-pagar').addEventListener('click', proceedToCheckout);

// Inicializa el carrito al cargar la página
updateCart();



function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');   // activa/desactiva oscuro
    body.classList.toggle('light-mode');  // activa/desactiva claro
}
