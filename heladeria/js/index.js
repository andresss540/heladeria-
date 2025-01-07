// Este código se ejecutará cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtenemos el elemento que contiene los productos
    const productos = document.getElementById("productos-destacados");

    // Verificamos si el contenedor de productos existe
    if (productos) {
        // Recorremos los productos
        const productCards = productos.querySelectorAll("article"); // Cambiado a 'article' para seleccionar los productos
        productCards.forEach(producto => {
            // Agregamos un evento de clic al elemento
            producto.addEventListener("click", function() {
                // Mostramos un mensaje de confirmación
                alert("Has seleccionado el producto " + producto.querySelector("h3").textContent);
            });
        });
    }

    // Manejo de eventos para los enlaces
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Prevenir comportamiento predeterminado
            if (this.href.includes("Login.html")) { // Asegúrate de que el nombre del archivo sea correcto
                window.open(this.href, "_blank");
            } else {
                window.location.href = this.href;
            }
        });
    });
});