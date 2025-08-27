const email = localStorage.getItem("email");
const usuarioEmail = document.getElementById("usuario-email");
const menuOpciones = document.getElementById("menu-opciones");
const cerrarSesion = document.getElementById("cerrar-sesion");

if (email) {
    usuarioEmail.textContent = email;

    usuarioEmail.addEventListener("click", () => {
        menuOpciones.style.display =
            menuOpciones.style.display === "block" ? "none" : "block";
    });

    cerrarSesion.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("email");
        window.location.reload();
    });

    window.addEventListener("click", (e) => {
        if (!e.target.matches("#usuario-email")) {
            menuOpciones.style.display = "none";
        }
    });
} else {
    usuarioEmail.textContent = "Iniciar sesión";
    usuarioEmail.onclick = () => {
        window.location.href = "login.html";
    };
    menuOpciones.style.display = "none";
}


