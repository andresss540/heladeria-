// Añadir event listeners
document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn__registrarse").addEventListener("click", register);
window.addEventListener("resize", ajustarVista);

// Declarar variables
const formularioLogin = document.querySelector(".formulario__login");
const formularioRegister = document.querySelector(".formulario__register");
const contenedorLoginRegister = document.querySelector(".contenedor__login-register");
const cajaTraseraLogin = document.querySelector(".caja__trasera-login");
const cajaTraseraRegister = document.querySelector(".caja__trasera-register");

// Ajustar vista basado en el ancho de la página
function ajustarVista() {
    if (window.innerWidth > 850) {
        cajaTraseraRegister.style.display = "block";
        cajaTraseraLogin.style.display = "block";
    } else {
        cajaTraseraRegister.style.display = "block";
        cajaTraseraRegister.style.opacity = "1";
        cajaTraseraLogin.style.display = "none";
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioRegister.style.display = "none";
    }
}

// Ejecutar ajuste de vista inicial
ajustarVista();

// Función para iniciar sesión
function iniciarSesion() {
    if (window.innerWidth > 850) {
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "10px";
        formularioRegister.style.display = "none";
        cajaTraseraRegister.style.opacity = "1";
        cajaTraseraLogin.style.opacity = "0";
    } else {
        formularioLogin.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioRegister.style.display = "none";
        cajaTraseraRegister.style.display = "block";
        cajaTraseraLogin.style.display = "none";
    }
}

// Función para registrarse
function register() {
    if (window.innerWidth > 850) {
        formularioRegister.style.display = "block";
        contenedorLoginRegister.style.left = "410px";
        formularioLogin.style.display = "none";
        cajaTraseraRegister.style.opacity = "0";
        cajaTraseraLogin.style.opacity = "1";
    } else {
        formularioRegister.style.display = "block";
        contenedorLoginRegister.style.left = "0px";
        formularioLogin.style.display = "none";
        cajaTraseraRegister.style.display = "none";
        cajaTraseraLogin.style.display = "block";
        cajaTraseraLogin.style.opacity = "1";
    }
}

// Función para manejar el registro (ejemplo de cómo podrías enviar datos al servidor)
async function enviarRegistro() {
    const nombre = document.getElementById("name-register").value;
    const password = document.getElementById("password-register").value;
    const identificacion = document.getElementById("id-register").value;
    const email = document.getElementById("email-register").value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, password, identificacion, email })
        });

        if (response.ok) {
            // Redirigir a página de inicio
            window.location.href = '/index.html';
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error al enviar el registro:', error);
        alert('Error al enviar el registro. Inténtalo de nuevo más tarde.');
    }
}

//