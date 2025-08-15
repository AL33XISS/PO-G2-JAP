if (localStorage.getItem("usuario")) {
  location.replace("index.html");
}

function myFunctionIngresar() {
  event.preventDefault();

  let usuario = document.querySelector('input[type="text"]').value;
  let password = document.querySelector('input[type="password"]').value;

  if (usuario !== "" && password !== "") {
    localStorage.setItem("usuario", usuario);
    location.replace("index.html");
  } else {
    alert("Por favor completa usuario y contraseña");
  }
}
