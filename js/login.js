if (localStorage.getItem("email")) {
  location.replace("index.html");
}

function myFunctionIngresar() {
  event.preventDefault();

  let email = document.querySelector('input[type="email"]').value;
  let password = document.querySelector('input[type="password"]').value;

  if (email !== "" && password !== "") {
    localStorage.setItem("email", email);
    location.replace("index.html");
  } else {
    alert("Por favor completa email y contraseña");
  }
}

