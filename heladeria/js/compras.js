'use strict'

// Variables globales
let carritoVisible = false;


document.addEventListener ('DOMContentLoaded', () => {
        inicializarCarrito();
    });

function inicializarCarrito() {
    document.addEventListener('click', manejarEventosCarrito);
    cargarCarritoDesdeLocalStorage();
}

function manejarEventosCarrito(event) {
    const target = event.target;
    
    const acciones = {
        'btn-eliminar': () => eliminarItemCarrito(event),
        'sumar-cantidad': () => cambiarCantidad(event, 1),
        'restar-cantidad': () => cambiarCantidad(event, -1),
        'boton-item': () => agregarAlCarritoClicked(event),
        'btn-pagar': () => pagarClicked()
    };

    for (const [clase, accion] of Object.entries(acciones)) {
        if (target.classList.contains(clase) || target.closest(`.${clase}`)) {
            accion();
            break;
        }
    }
}

function pagarClicked() {
    const carritoItems = document.querySelector('.carrito-items');
    if (!carritoItems || carritoItems.children.length === 0) {
        alert("El carrito está vacío. Agrega algunos productos primero.");
        return;
    }

    const confirmarCompra = confirm("¿Estás seguro de realizar la compra?");
    if (confirmarCompra) {
        carritoItems.innerHTML = '';
        actualizarTotalCarrito();
        ocultarCarrito();
        localStorage.removeItem('carrito');
        alert("¡Gracias por tu compra! Tu pedido será procesado.");
    }
}

function agregarAlCarritoClicked(event) {
    const item = event.target.closest('.item');
    if (!item) return;

    const titulo = item.querySelector('.titulo-item');
    const precio = item.querySelector('.precio-item');
    const imagen = item.querySelector('.img-item');

    if (!titulo || !precio || !imagen) {
        console.error('Elementos necesarios no encontrados en el item');
        return;
    }

    agregarItemAlCarrito(titulo.textContent, precio.textContent, imagen.src);
    hacerVisibleCarrito();
}

function hacerVisibleCarrito() {
    const carrito = document.querySelector('.carrito');
    const items = document.querySelector('.contenedor-items');
    
    if (!carrito || !items) return;
    
    carritoVisible = true;
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';
    items.style.width = '60%';
}

function obtenerPrecioNumerico(precioTexto) {
    // Eliminar el símbolo de peso y los puntos de miles, y reemplazar la coma por punto
    return parseFloat(precioTexto.replace(/[$\s.]/g, '').replace(',', '.')) || 0;
}

function formatearPrecio(numero) {
    return `$ ${numero.toLocaleString('es-CO')}`;
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    const itemsCarrito = document.querySelector('.carrito-items');
    if (!itemsCarrito) return;
    
    // Verificar si el item ya existe
    const itemExistente = itemsCarrito.querySelector(`.carrito-item-titulo[data-titulo="${titulo}"]`);
    if (itemExistente) {
        alert("El item ya se encuentra en el carrito");
        return;
    }

    const nuevoItem = document.createElement('div');
    nuevoItem.classList.add('carrito-item');
    
    // Asegurarse de que el precio está en el formato correcto
    const precioNumerico = obtenerPrecioNumerico(precio);
    const precioFormateado = formatearPrecio(precioNumerico);

    nuevoItem.innerHTML = `
        <img src="${imagenSrc}" width="80px" alt="${titulo}">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo" data-titulo="${titulo}">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad" aria-label="Restar cantidad"></i>
                <input type="number" value="1" min="1" class="carrito-item-cantidad" aria-label="Cantidad">
                <i class="fa-solid fa-plus sumar-cantidad" aria-label="Sumar cantidad"></i>
            </div>
            <span class="carrito-item-precio" data-precio="${precioNumerico}">${precioFormateado}</span>
        </div>
        <button class="btn-eliminar" aria-label="Eliminar del carrito">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    itemsCarrito.appendChild(nuevoItem);
    actualizarTotalCarrito();
    guardarCarritoEnLocalStorage();
}

function actualizarTotalCarrito() {
    const carritoItems = document.querySelectorAll('.carrito-item');
    let total = 0;

    carritoItems.forEach(item => {
        const precioElement = item.querySelector('.carrito-item-precio');
        const cantidadElement = item.querySelector('.carrito-item-cantidad');
        
        if (!precioElement || !cantidadElement) return;

        const precio = obtenerPrecioNumerico(precioElement.textContent);
        const cantidad = parseInt(cantidadElement.value) || 1;
        
        total += precio * cantidad;
    });

    const totalElement = document.querySelector('.carrito-precio-total');
    if (totalElement) {
        totalElement.textContent = formatearPrecio(total);
    }
}

function cambiarCantidad(event, delta) {
    const selector = event.target.closest('.selector-cantidad');
    if (!selector) return;

    const cantidadInput = selector.querySelector('.carrito-item-cantidad');
    if (cantidadInput) {
        const nuevoValor = Math.max(parseInt(cantidadInput.value || 1) + delta, 1);
        cantidadInput.value = nuevoValor;
        actualizarTotalCarrito();
        guardarCarritoEnLocalStorage();
    }
}

function eliminarItemCarrito(event) {
    const itemCarrito = event.target.closest('.carrito-item');
    if (!itemCarrito) return;

    itemCarrito.remove();
    actualizarTotalCarrito();
    
    const carritoItems = document.querySelector('.carrito-items');
    if (carritoItems && carritoItems.children.length === 0) {
        ocultarCarrito();
    }
    
    guardarCarritoEnLocalStorage();
}

function ocultarCarrito() {
    const carrito = document.querySelector('.carrito');
    const items = document.querySelector('.contenedor-items');
    
    if (!carrito || !items) return;
    
    carritoVisible = false;
    carrito.style.marginRight = '-100%';
    carrito.style.opacity = '0';
    items.style.width = '100%';
}

function guardarCarritoEnLocalStorage() {
    const carritoItems = document.querySelectorAll('.carrito-item');
    const items = Array.from(carritoItems).map(item => {
        const titulo = item.querySelector('.carrito-item-titulo');
        const precio = item.querySelector('.carrito-item-precio');
        const cantidad = item.querySelector('.carrito-item-cantidad');
        const imagen = item.querySelector('img');

        if (!titulo || !precio || !cantidad || !imagen) return null;

        return {
            titulo: titulo.dataset.titulo,
            precio: precio.textContent,
            imagenSrc: imagen.src,
            cantidad: cantidad.value
        };
    }).filter(item => item !== null);
    
    localStorage.setItem('carrito', JSON.stringify(items));
}

function cargarCarritoDesdeLocalStorage() {
    try {
        const items = JSON.parse(localStorage.getItem('carrito')) || [];
        
        items.forEach(item => {
            if (item && item.titulo && item.precio && item.imagenSrc) {
                agregarItemAlCarrito(item.titulo, item.precio, item.imagenSrc);
                
                const cantidadInput = document.querySelector(
                    `.carrito-item-titulo[data-titulo="${item.titulo}"]`
                )?.closest('.carrito-item')?.querySelector('.carrito-item-cantidad');
                
                if (cantidadInput && item.cantidad) {
                    cantidadInput.value = item.cantidad;
                }
            }
        });
        
        if (items.length > 0) {
            hacerVisibleCarrito();
            actualizarTotalCarrito();
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        localStorage.removeItem('carrito');
    }
}