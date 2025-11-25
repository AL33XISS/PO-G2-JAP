let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const COTIZACION_USD = 40.50; 

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar productos en el carrito
function mostrarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    contenedor.innerHTML = '';
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="font-size: 1.3vw; color: gray; text-align: center; padding: 40px;">El carrito está vacío.</p>';
        actualizarCostos();
        return;
    }
    
    carrito.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        
        // Convertir precio a USD
        const precioUSD = convertirAUSD(producto.price, producto.currency);
        const subtotalProducto = precioUSD * producto.quantity;
        
        item.innerHTML = `
            <img src="${producto.image || 'img/placeholder.png'}" alt="${producto.name}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-name">${producto.name}</span>
                <span class="cart-item-desc">${producto.description || ''}</span>
                <span>

            <div class="cart-item-controls" style="justify-content: space-between !important"> 
                <div>
                                <span class="cart-item-price">USD $${precioUSD.toFixed(2)}</span>
                    ${producto.currency !== 'USD' ? `<span class="cart-item-original">(${producto.currency} $${producto.price.toFixed(2)})</span>` : ''}
                </span>
                </div>
                <div><input style="align-items:center" type="number"  value="${producto.quantity}" min="1" 
                    onchange="cambiarCantidad(${producto.id}, this.value)">
                <button onclick="quitarProducto(${producto.id})">Eliminar</button>
                </div>
            </div>
            </div>
        `;
        contenedor.appendChild(item);
    });
    
    actualizarCostos();
    guardarCarrito();
    
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

// Cambiar cantidad de un producto
window.cambiarCantidad = function(idProducto, nuevaCantidad) {
    const producto = carrito.find(p => p.id === idProducto);
    if (producto) {
        producto.quantity = parseInt(nuevaCantidad);
        if (producto.quantity <= 0) {
            quitarProducto(idProducto);
        } else {
            guardarCarrito(); 
            mostrarCarrito();
            
            // Actualizar badge
            if (typeof updateCartBadge === 'function') {
                updateCartBadge();
            }
        }
    }
};

// Quitar producto del carrito
window.quitarProducto = function(idProducto) {
    const producto = carrito.find(p => p.id === idProducto);
    
    if (producto && confirm(`¿Estás seguro que deseas eliminar "${producto.name}" del carrito?`)) {
        carrito = carrito.filter(p => p.id !== idProducto);
        guardarCarrito();
        mostrarCarrito();
        
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        };
    }
};

// Calcular subtotal 
function calcularSubtotal() {
    return carrito.reduce((suma, producto) => {
        const precioUSD = convertirAUSD(producto.price, producto.currency);
        return suma + (precioUSD * producto.quantity);
    }, 0);
}

// Actualizar todos los costos en tiempo real
function actualizarCostos() {
    const subtotal = calcularSubtotal();
    const porcentajeEnvio = obtenerPorcentajeEnvio();
    const costoEnvio = subtotal * porcentajeEnvio;
    const total = subtotal + costoEnvio;
    
    document.getElementById('subtotal-valor').innerText = `USD $${subtotal.toFixed(2)}`;
    document.getElementById('envio-valor').innerText = `USD $${costoEnvio.toFixed(2)}`;
    document.getElementById('total-final').innerText = `USD $${total.toFixed(2)}`;
}

// Obtener el porcentaje de envío seleccionado
function obtenerPorcentajeEnvio() {
    const seleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
    return seleccionado ? parseFloat(seleccionado.value) : 0.05;
}

// Mostrar formulario de pago según la opción elegida
function configurarFormasPago() {
    const radioTarjeta = document.getElementById('pagoTarjeta');
    const radioTransferencia = document.getElementById('pagoTransferencia');
    const formTarjeta = document.getElementById('formTarjeta');
    const formTransferencia = document.getElementById('formTransferencia');
    
    radioTarjeta.addEventListener('change', function() {
        if (this.checked) {
            formTarjeta.style.display = 'block';
            formTransferencia.style.display = 'none';
        }
    });
    
    radioTransferencia.addEventListener('change', function() {
        if (this.checked) {
            formTransferencia.style.display = 'block';
            formTarjeta.style.display = 'none';
        }
    });
}

// Validar que los campos no estén vacíos
function validarCampo(id) {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
        campo.classList.add('campo-error');
        return false;
    }
    campo.classList.remove('campo-error');
    return true;
}

// Validar todo el formulario antes de finalizar
function validarCompra() {
    if (carrito.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
        return false;
    }
    
    // 2. Validar cantidades de productos
    let productosSinCantidad = [];
    for (let producto of carrito) {
        if (!producto.quantity || producto.quantity <= 0) {
            productosSinCantidad.push(producto.name);
        }
    }
    
    if (productosSinCantidad.length > 0) {
        alert('Los siguientes productos deben tener una cantidad mayor a 0:\n\n' + 
              productosSinCantidad.map(p => '- ' + p).join('\n'));
        return false;
    }
    
    // 3. Validar dirección de envío
    const camposDireccion = [
        { id: 'departamento', nombre: 'Departamento' },
        { id: 'localidad', nombre: 'Localidad' },
        { id: 'calle', nombre: 'Calle' },
        { id: 'numero', nombre: 'Número' },
        { id: 'esquina', nombre: 'Esquina' }
    ];
    
    let camposDireccionVacios = [];
    camposDireccion.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input.value.trim()) {
            input.classList.add('campo-error');
            camposDireccionVacios.push(campo.nombre);
        } else {
            input.classList.remove('campo-error');
        }
    });
    
    if (camposDireccionVacios.length > 0) {
        alert('Completa los siguientes campos de dirección:\n\n' +
              camposDireccionVacios.map(c => '- ' + c).join('\n'));
        
        const seccionDireccion = document.querySelector('.seccion-direccion');
        const wrapper = seccionDireccion.querySelector('.contenido-colapsable');
        if (!wrapper.classList.contains('expandido')) {
            seccionDireccion.click();
        }
        
        return false;
    }
    
    // 4. Validar tipo de envío
    const tipoEnvio = document.querySelector('input[name="tipoEnvio"]:checked');
    if (!tipoEnvio) {
        alert('Debes seleccionar un tipo de envío.');
        
        const seccionEnvio = document.querySelector('.seccion-envio');
        const wrapper = seccionEnvio.querySelector('.contenido-colapsable');
        if (!wrapper.classList.contains('expandido')) {
            seccionEnvio.click();
        }
        
        return false;
    }
    
    // 5. Validar forma de pago
    const formaPago = document.querySelector('input[name="formaPago"]:checked');
    if (!formaPago) {
        alert('Debes seleccionar una forma de pago.');
        
        const seccionPago = document.querySelector('.seccion-pago');
        const wrapper = seccionPago.querySelector('.contenido-colapsable');
        if (!wrapper.classList.contains('expandido')) {
            seccionPago.click();
        }
        
        return false;
    }
    
    // 6. Validar campos específicos de forma de pago
    let camposPagoVacios = [];
    
    if (formaPago.value === 'tarjeta') {
        const camposTarjeta = [
            { id: 'numTarjeta', nombre: 'Número de tarjeta' },
            { id: 'vencimiento', nombre: 'Fecha de vencimiento' },
            { id: 'cvv', nombre: 'CVV' }
        ];
        
        camposTarjeta.forEach(campo => {
            const input = document.getElementById(campo.id);
            if (!input.value.trim()) {
                input.classList.add('campo-error');
                camposPagoVacios.push(campo.nombre);
            } else {
                input.classList.remove('campo-error');
            }
        });
        
        if (camposPagoVacios.length > 0) {
            alert('Completa los siguientes campos de la tarjeta:\n\n' +
                  camposPagoVacios.map(c => '- ' + c).join('\n'));
            
            const seccionPago = document.querySelector('.seccion-pago');
            const wrapper = seccionPago.querySelector('.contenido-colapsable');
            if (!wrapper.classList.contains('expandido')) {
                seccionPago.click();
            }
            
            return false;
        }
        
        // Validar formato de número de tarjeta
        const numTarjeta = document.getElementById('numTarjeta').value.replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(numTarjeta)) {
            document.getElementById('numTarjeta').classList.add('campo-error');
            alert('El número de tarjeta debe tener entre 13 y 19 dígitos.');
            return false;
        }
        
        // Validar formato de vencimiento
        const vencimiento = document.getElementById('vencimiento').value;
        if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
            document.getElementById('vencimiento').classList.add('campo-error');
            alert('Formato de fecha incorrecto. Usa MM/AA (ejemplo: 12/25)');
            return false;
        }
        
        // Validar CVV
        const cvv = document.getElementById('cvv').value;
        if (!/^\d{3,4}$/.test(cvv)) {
            document.getElementById('cvv').classList.add('campo-error');
            alert('El CVV debe tener 3 o 4 dígitos.');
            return false;
        }
        
    } else if (formaPago.value === 'transferencia') {
        const camposTransferencia = [
            { id: 'numCuenta', nombre: 'Número de cuenta' },
            { id: 'banco', nombre: 'Banco' }
        ];
        
        camposTransferencia.forEach(campo => {
            const input = document.getElementById(campo.id);
            if (!input.value.trim()) {
                input.classList.add('campo-error');
                camposPagoVacios.push(campo.nombre);
            } else {
                input.classList.remove('campo-error');
            }
        });
        
        if (camposPagoVacios.length > 0) {
            alert('Completa los siguientes campos de la transferencia:\n\n' +
                  camposPagoVacios.map(c => '- ' + c).join('\n'));
            
            const seccionPago = document.querySelector('.seccion-pago');
            const wrapper = seccionPago.querySelector('.contenido-colapsable');
            if (!wrapper.classList.contains('expandido')) {
                seccionPago.click();
            }
            
            return false;
        }
    }
    
    return true;
}

// Finalizar compra
async function finalizarCompra() {
    if (validarCompra()) {
        // Simular envío de datos
        const datosCompra = {
            productos: carrito,
            direccion: {
                departamento: document.getElementById('departamento').value,
                localidad: document.getElementById('localidad').value,
                calle: document.getElementById('calle').value,
                numero: document.getElementById('numero').value,
                esquina: document.getElementById('esquina').value
            },
            envio: document.querySelector('input[name="tipoEnvio"]:checked').value,
            pago: document.querySelector('input[name="formaPago"]:checked').value,
            total: document.getElementById('total-final').innerText
        };
        
        console.log('Datos de compra:', datosCompra);

        // Guardar carrito en la base de datos
try {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('email');
    
    // Mapear email a usuario_id 
    const usuarioId = email === 'sebastiansilvayferrer@JAP' ? 1 : 
                  email === 'agustinfourcade@JAP' ? 2 : 
                  email === 'alexissarsamendi@JAP' ? 3 : 
                  email === 'invitado@JAP' ? 4 : 1; 
    
    const itemsCarrito = carrito.map(producto => ({
        producto_id: producto.id,
        cantidad: producto.quantity
    }));

    console.log('Items a guardar:', itemsCarrito);
    console.log('Usuario ID:', usuarioId);
    
    if (token) {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                items: itemsCarrito
            })
        });
        
        const resultado = await response.json();
        console.log('Carrito guardado en BD:', resultado);
    }
} catch (error) {
    console.error('Error al guardar carrito:', error);
}
        
        alert('¡Compra realizada con éxito! \n\nTotal: ' + datosCompra.total + '\n\nGracias por tu compra.');
        
        // Limpiar carrito
        carrito = [];
        guardarCarrito();
        mostrarCarrito();

        if (typeof updateCartBadge === 'function') {
    updateCartBadge();
}
        
        // Limpiar formularios
        document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        document.getElementById('standard').checked = true;
        document.getElementById('formTarjeta').style.display = 'none';
        document.getElementById('formTransferencia').style.display = 'none';
    }
}

// Escuchar cambios en tipo de envío para actualizar costos
document.querySelectorAll('input[name="tipoEnvio"]').forEach(radio => {
    radio.addEventListener('change', actualizarCostos);
});

// Hacer secciones colapsables con animación mejorada
function hacerSeccionesColapsables() {
    const secciones = document.querySelectorAll('.seccion-envio, .seccion-direccion, .seccion-pago');
    
    secciones.forEach(seccion => {
        const titulo = seccion.querySelector('h3');
        if (titulo) {
            // Crear estructura mejorada
            const textoOriginal = titulo.textContent.trim();
            
            titulo.innerHTML = `
                <span class="titulo-texto">
                    ${textoOriginal}
                </span>
                <span class="icono-toggle">+</span>
            `;
            
            titulo.style.cursor = 'pointer';
            titulo.style.userSelect = 'none';
            
            // Envolver el contenido en un div colapsable
            const contenido = Array.from(seccion.children).filter(el => el !== titulo);
            const wrapper = document.createElement('div');
            wrapper.className = 'contenido-colapsable';
            
            contenido.forEach(el => {
                wrapper.appendChild(el);
            });
            
            seccion.appendChild(wrapper);
            
            // Iniciar cerrado
            wrapper.style.maxHeight = '0';
            wrapper.style.opacity = '0';
            wrapper.style.padding = '0 22px';
            
            // Función para toggle
            const toggleSeccion = (e) => {
                // Prevenir que clicks en inputs/labels activen el toggle
                if (e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'LABEL' || 
                    e.target.tagName === 'TEXTAREA' ||
                    e.target.tagName === 'SELECT' ||
                    e.target.tagName === 'BUTTON' ||
                    e.target.closest('.opcion-radio') ||
                    e.target.closest('.campo-form') ||
                    e.target.closest('.form-pago')) {
                    return; // NO hacer nada si clickeó en elementos interactivos
                }
                
                const icono = titulo.querySelector('.icono-toggle');
                
                if (wrapper.classList.contains('expandido')) {
                    // Cerrar
                    wrapper.style.maxHeight = '0';
                    wrapper.style.opacity = '0';
                    wrapper.style.padding = '0 22px';
                    wrapper.classList.remove('expandido');
                    icono.classList.remove('rotado');
                    icono.textContent = '+';
                } else {
                    // Abrir
                    wrapper.classList.add('expandido');
                    wrapper.style.opacity = '1';
                    wrapper.style.padding = '20px 22px 22px 22px';
                    icono.classList.add('rotado');
                    icono.textContent = '−';
                    
                    // Calcular altura real después de mostrar el contenido
                    setTimeout(() => {
                        const alturaReal = wrapper.scrollHeight;
                        wrapper.style.maxHeight = (alturaReal + 50) + 'px'; // +50px margen extra
                    }, 10);
                    
                    // Recalcular si hay formularios que cambian de visibilidad
                    setTimeout(() => {
                        const alturaFinal = wrapper.scrollHeight;
                        wrapper.style.maxHeight = (alturaFinal + 50) + 'px';
                    }, 100);
                }
            };
            
            // Hacer clickeable SOLO el título
            titulo.addEventListener('click', toggleSeccion);
        }
    });
}

        // Convertir precio a USD si está en otra moneda
        function convertirAUSD(precio, moneda) {
            if (!moneda || moneda === 'USD') {
                return precio;
            }
            
            // Si es en pesos uruguayos (UYU)
            if (moneda === 'UYU') {
                return precio / COTIZACION_USD;
            }
            
            // Si por alguna razón viene sin moneda o en otra, asumir USD
            return precio;
        }


// Configurar botón de finalizar compra
document.getElementById('btn-finalizar').addEventListener('click', finalizarCompra);

// Inicializar
configurarFormasPago();
mostrarCarrito();
hacerSeccionesColapsables();
